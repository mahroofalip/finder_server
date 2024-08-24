import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message'; // Import the Message model
import { notifyUser } from '../sockets/socket';
import { Op } from 'sequelize';
import Room from '../models/Rooms';
import sequelize from '../config/database';
import User from '../models/User';
import EyeColor from '../models/EyeColor';


interface AuthenticatedRequest extends Request {
    user?: { id: number };
}

export const getUserChats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const userId = req.user.id;
        const userChats = await Room.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            include: [
                { model: User, as: 'Sender', attributes: { exclude: [] } },
                { model: User, as: 'Receiver', attributes: { exclude: [] } }
            ]
        });
        res.status(200).send(userChats);
    } catch (error) {
        next(error);
    }
};

export const createRoomAndSendMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();

    try {
        const { receiver_id, sender_id, message_content } = req.body;

        // Check if a room already exists between the sender and receiver
        let room = await Room.findOne({
            where: {
                senderId: sender_id,
                receiverId: receiver_id,
            },
            transaction
        });

        // If no room exists, create a new one
        if (!room) {
            room = await Room.create({
                senderId: sender_id,
                receiverId: receiver_id,
                last_message_content: message_content
            }, { transaction });
        } else {
            // Update the existing room's last_message_content
            await room.update({
                last_message_content: message_content
            }, { transaction });
        }

        const message = await Message.create({
            message_content: message_content,
            room_id: room.id,
            status: "unread",
        }, { transaction });

        // Notify the user
         notifyUser( message_content);

        // Commit the transaction
        await transaction.commit();

        // Send the response back to the client
        res.status(200).send({ room, message });
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        next(error);
    }
};



export const getMessagesByRoomId = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const { roomId } = req.body; 

        if (!roomId) {
            throw new Error('Room ID is required');
        }
        const messages = await Message.findAll({
            where: { room_id: roomId },
            order: [['createdAt', 'ASC']] // Optional: to sort messages by creation time
        });

        res.status(200).send({ status: true, messages });
    } catch (error) {
        next(error);
    }
};



// sendMessage

export const createNewMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();

    try {
        const { roomId, newMessage } = req.body;

        // Fetch the room by roomId
        const room = await Room.findByPk(roomId, { transaction });

        if (!room) {
            throw new Error('Room not found');
        }

        // Create a new message with the provided roomId
        const message = await Message.create({
            message_content: newMessage,
            room_id: room.id,
            status: 'unread',
        }, { transaction });

        // Update the existing room's last_message_content
        await room.update({
            last_message_content: newMessage,
        }, { transaction });
        // Notify the user 

        notifyUser(message.dataValues);

        // Commit the transaction
        await transaction.commit();

        // Send the response back to the client
        res.status(200).send({ room, message });
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        next(error);
    }
};