    import { Request, Response, NextFunction } from 'express';
    import Message from '../models/Message'; // Import the Message model
    import { notifyUser } from '../sockets/socket';
    import { Op } from 'sequelize';
    import Room from '../models/Rooms';
    import sequelize from '../config/database';
    import User from '../models/User';
    import EyeColor from '../models/EyeColor';
import BlockedUsers from '../models/BlockedUsers';


    interface AuthenticatedRequest extends Request {
        user?: { id: number };
    }

    export const getUserChats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }
            const userId = req.user.id;
    
            // Get list of users blocked by or who blocked the current user
            const blockedUsers = await BlockedUsers.findAll({
                where: {
                    [Op.or]: [
                        { userId }, // Users the current user has blocked
                        { profileId: userId } // Users who have blocked the current user
                    ]
                }
            });
    
            // Extract blocked user IDs
            const blockedUserIds = blockedUsers.map(block => block.userId === userId ? block.profileId : block.userId);
    
            // Fetch chats excluding rooms involving blocked users
            const userChats = await Room.findAll({
                where: {
                    [Op.or]: [
                        { senderId: userId },
                        { receiverId: userId }
                    ],
                    [Op.and]: [
                        { senderId: { [Op.notIn]: blockedUserIds } },
                        { receiverId: { [Op.notIn]: blockedUserIds } }
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
        const userId = req.user?.id?.toString();
    
        try {
            const { receiver_id, sender_id, message_content } = req.body;
    
            // Check if the current user is blocked by or has blocked the other user
            const blockedUsers = await BlockedUsers.findAll({
                where: {
                    [Op.or]: [
                        { userId: sender_id, profileId: receiver_id },
                        { userId: receiver_id, profileId: sender_id }
                    ]
                }
            });
    
            if (blockedUsers.length > 0) {
                return res.status(403).json({
                    message: "You cannot create a room or send a message because either you or the recipient has blocked the other."
                });
            }
    
            // Check if a room already exists between the sender and receiver
            let room = await Room.findOne({
                where: {
                    senderId: sender_id,
                    receiverId: receiver_id
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
    
            // Create a new message
            const message = await Message.create({
                message_content: message_content,
                room_id: room.id,
                status: "unread",
                receiverId: receiver_id,
                senderId: sender_id
            }, { transaction });
    
            // Update the sender's lastActiveAt field
            const sender = await User.findByPk(sender_id, { transaction });
            if (sender) {
                await sender.update({ lastActiveAt: new Date() }, { transaction });
            }
    
            // Notify the user
            notifyUser(message_content, userId);
    
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
            const userId = req.user.id;
    
            if (!roomId) {
                throw new Error('Room ID is required');
            }
    
            // Fetch the room
            const room = await Room.findByPk(roomId);
    
            if (!room) {
                throw new Error('Room not found');
            }
    
            // Check if the room involves any blocked users
            const blockedUsers = await BlockedUsers.findAll({
                where: {
                    [Op.or]: [
                        { userId },
                        { profileId: userId }
                    ]
                }
            });
    
            const blockedUserIds = blockedUsers.map(block => block.userId === userId ? block.profileId : block.userId);
    
            if (blockedUserIds.includes(room.senderId) || blockedUserIds.includes(room.receiverId)) {
                return res.status(403).json({ message: "You cannot view messages from a blocked user or if you're blocked." });
            }
    
            const messages = await Message.findAll({
                where: { room_id: roomId },
                order: [['createdAt', 'ASC']]
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
            const userId = req.user?.id?.toString();
    
            if (!roomId || !newMessage) {
                throw new Error('Room ID and message content are required');
            }
    
            const room = await Room.findByPk(roomId, { transaction });
    
            if (!room) {
                throw new Error('Room not found');
            }
    
            // Check if the current user is either the sender or receiver in the room
            let receiverId: string = "0";
            const senderId: any = userId;
    
            if (room.receiverId.toString() === userId) {
                receiverId = room.senderId.toString();
            } else if (room.senderId.toString() === userId) {
                receiverId = room.receiverId.toString();
            } else {
                throw new Error('User is not part of this room');
            }
    
            // Check if the users involved in the room have blocked each other
            const blockedUsers = await BlockedUsers.findAll({
                where: {
                    [Op.or]: [
                        { userId: senderId, profileId: receiverId },
                        { userId: receiverId, profileId: senderId }
                    ]
                }
            });
    
            if (blockedUsers.length > 0) {
                return res.status(403).json({
                    message: "You cannot send messages because either you or the recipient has blocked the other."
                });
            }
    
            // Create the message
            const message = await Message.create({
                message_content: newMessage,
                room_id: room.id,
                status: 'unread',
                receiverId: receiverId,
                senderId: senderId
            }, { transaction });
    
            // Update the room's last_message_content
            await room.update({
                last_message_content: newMessage
            }, { transaction });
    
            // Update the sender's lastActiveAt field
            const sender = await User.findByPk(senderId, { transaction });
            if (sender) {
                await sender.update({ lastActiveAt: new Date() }, { transaction });
            }
    
            // Notify the user
            notifyUser(message.dataValues, userId);
    
            // Commit the transaction
            await transaction.commit();
    
            res.status(200).send({ room, message });
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    };
    
    
