"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewMessage = exports.getMessagesByRoomId = exports.createRoomAndSendMessage = exports.getUserChats = void 0;
const Message_1 = __importDefault(require("../models/Message")); // Import the Message model
const socket_1 = require("../sockets/socket");
const sequelize_1 = require("sequelize");
const Rooms_1 = __importDefault(require("../models/Rooms"));
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("../models/User"));
const BlockedUsers_1 = __importDefault(require("../models/BlockedUsers"));
const getUserChats = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const userId = req.user.id;
        // Get list of users blocked by or who blocked the current user
        const blockedUsers = await BlockedUsers_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { userId }, // Users the current user has blocked
                    { profileId: userId } // Users who have blocked the current user
                ]
            }
        });
        // Extract blocked user IDs
        const blockedUserIds = blockedUsers.map(block => block.userId === userId ? block.profileId : block.userId);
        // Fetch chats excluding rooms involving blocked users
        const userChats = await Rooms_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { senderId: userId },
                    { receiverId: userId }
                ],
                [sequelize_1.Op.and]: [
                    { senderId: { [sequelize_1.Op.notIn]: blockedUserIds } },
                    { receiverId: { [sequelize_1.Op.notIn]: blockedUserIds } }
                ]
            },
            include: [
                { model: User_1.default, as: 'Sender', attributes: { exclude: [] } },
                { model: User_1.default, as: 'Receiver', attributes: { exclude: [] } }
            ]
        });
        res.status(200).send(userChats);
    }
    catch (error) {
        next(error);
    }
};
exports.getUserChats = getUserChats;
const createRoomAndSendMessage = async (req, res, next) => {
    const transaction = await database_1.default.transaction();
    const userId = req.user?.id?.toString();
    try {
        const { receiver_id, sender_id, message_content } = req.body;
        // Check if the current user is blocked by or has blocked the other user
        const blockedUsers = await BlockedUsers_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
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
        let room = await Rooms_1.default.findOne({
            where: {
                senderId: sender_id,
                receiverId: receiver_id
            },
            transaction
        });
        // If no room exists, create a new one
        if (!room) {
            room = await Rooms_1.default.create({
                senderId: sender_id,
                receiverId: receiver_id,
                last_message_content: message_content
            }, { transaction });
        }
        else {
            // Update the existing room's last_message_content
            await room.update({
                last_message_content: message_content
            }, { transaction });
        }
        // Create a new message
        const message = await Message_1.default.create({
            message_content: message_content,
            room_id: room.id,
            status: "unread",
            receiverId: receiver_id,
            senderId: sender_id
        }, { transaction });
        // Update the sender's lastActiveAt field
        const sender = await User_1.default.findByPk(sender_id, { transaction });
        if (sender) {
            await sender.update({ lastActiveAt: new Date() }, { transaction });
        }
        // Notify the user
        (0, socket_1.notifyUser)(message_content, userId);
        // Commit the transaction
        await transaction.commit();
        // Send the response back to the client
        res.status(200).send({ room, message });
    }
    catch (error) {
        // Rollback the transaction in case of error
        await transaction.rollback();
        next(error);
    }
};
exports.createRoomAndSendMessage = createRoomAndSendMessage;
const getMessagesByRoomId = async (req, res, next) => {
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
        const room = await Rooms_1.default.findByPk(roomId);
        if (!room) {
            throw new Error('Room not found');
        }
        // Check if the room involves any blocked users
        const blockedUsers = await BlockedUsers_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { userId },
                    { profileId: userId }
                ]
            }
        });
        const blockedUserIds = blockedUsers.map(block => block.userId === userId ? block.profileId : block.userId);
        if (blockedUserIds.includes(room.senderId) || blockedUserIds.includes(room.receiverId)) {
            return res.status(403).json({ message: "You cannot view messages from a blocked user or if you're blocked." });
        }
        const messages = await Message_1.default.findAll({
            where: { room_id: roomId },
            order: [['createdAt', 'ASC']]
        });
        res.status(200).send({ status: true, messages });
    }
    catch (error) {
        next(error);
    }
};
exports.getMessagesByRoomId = getMessagesByRoomId;
// sendMessage
const createNewMessage = async (req, res, next) => {
    const transaction = await database_1.default.transaction();
    try {
        const { roomId, newMessage } = req.body;
        const userId = req.user?.id?.toString();
        if (!roomId || !newMessage) {
            throw new Error('Room ID and message content are required');
        }
        const room = await Rooms_1.default.findByPk(roomId, { transaction });
        if (!room) {
            throw new Error('Room not found');
        }
        // Check if the current user is either the sender or receiver in the room
        let receiverId = "0";
        const senderId = userId;
        if (room.receiverId.toString() === userId) {
            receiverId = room.senderId.toString();
        }
        else if (room.senderId.toString() === userId) {
            receiverId = room.receiverId.toString();
        }
        else {
            throw new Error('User is not part of this room');
        }
        // Check if the users involved in the room have blocked each other
        const blockedUsers = await BlockedUsers_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
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
        const message = await Message_1.default.create({
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
        const sender = await User_1.default.findByPk(senderId, { transaction });
        if (sender) {
            await sender.update({ lastActiveAt: new Date() }, { transaction });
        }
        // Notify the user
        (0, socket_1.notifyUser)(message.dataValues, userId);
        // Commit the transaction
        await transaction.commit();
        res.status(200).send({ room, message });
    }
    catch (error) {
        await transaction.rollback();
        next(error);
    }
};
exports.createNewMessage = createNewMessage;
