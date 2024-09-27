"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLikesForUser = exports.addLike = void 0;
const Like_1 = __importDefault(require("../models/Like"));
const User_1 = __importDefault(require("../models/User"));
const BlockedUsers_1 = __importDefault(require("../models/BlockedUsers"));
const Rooms_1 = __importDefault(require("../models/Rooms"));
const sequelize_1 = require("sequelize");
// Add a like
const addLike = async (req, res, next) => {
    const { profileId } = req.body;
    let userId = req?.user?.id;
    if (!userId || !profileId) {
        return res.status(400).json({ message: 'UserId and ProfileId are required' });
    }
    try {
        const existingLike = await Like_1.default.findOne({ where: { userId, profileId } });
        if (existingLike) {
            await existingLike.destroy();
            return res.status(201).json({ message: 'You already liked this profile' });
        }
        const like = await Like_1.default.create({ userId, profileId });
        res.status(201).json(like);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.addLike = addLike;
// Get all likes for a user
const getLikesForUser = async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        // Step 1: Fetch all blocked profile IDs for the current user
        const blockedProfiles = await BlockedUsers_1.default.findAll({
            where: {
                userId: userId // Only profiles that this user has blocked
            },
            attributes: ['profileId']
        });
        const blockedProfileIds = blockedProfiles.map(profile => profile.profileId);
        // Step 2: Fetch all rooms where the current user is either sender or receiver
        const rooms = await Rooms_1.default.findAll({
            where: {
                [sequelize_1.Op.or]: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            attributes: ['senderId', 'receiverId']
        });
        // Get a list of user IDs from rooms (those connected to the current user)
        const roomUserIds = rooms.reduce((acc, room) => {
            acc.push(room.senderId, room.receiverId);
            return acc;
        }, []);
        // Step 3: Fetch all likes where the current user's profileId is liked by others
        const likes = await Like_1.default.findAll({
            where: { profileId: userId },
            include: [{ model: User_1.default, as: 'user' }] // Include the user who liked the current user's profile
        });
        // Step 4: Extract the liked users and check if the current user liked them back
        const likedUsersWithIsLiked = await Promise.all(likes.map(async (like) => {
            const user = like.user;
            if (!user || blockedProfileIds.includes(user.id) || roomUserIds.includes(user.id)) {
                // Skip if the user is blocked, connected via a room, or undefined
                return null;
            }
            // Check if the current user has liked this user back
            const isLiked = await Like_1.default.findOne({
                where: {
                    userId: userId,
                    profileId: user.id
                }
            });
            return {
                ...user.toJSON(),
                isLiked: !!isLiked // `isLiked` will be true if the current user liked this user back, otherwise false
            };
        }));
        // Step 5: Filter out any null values (cases where like.user was undefined, blocked, or connected via room)
        const filteredLikedUsers = likedUsersWithIsLiked.filter(user => user !== null);
        // Step 6: Return the list of filtered liked users with the `isLiked` field
        res.status(200).json(filteredLikedUsers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getLikesForUser = getLikesForUser;
