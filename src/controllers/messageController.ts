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
        // console.log(req.body, "req.body");

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
        await notifyUser(room.id, message_content);

        // Commit the transaction
        await transaction.commit();

        // Send the response back to the client
        res.status(200).send({ room, message });
    } catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        // console.log(error);
        next(error);
    }
};


