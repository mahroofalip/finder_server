"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockedProfiles = exports.unblockUserProfile = exports.blockUserProfile = void 0;
const BlockedUsers_1 = __importDefault(require("../models/BlockedUsers"));
const User_1 = __importDefault(require("../models/User"));
const Like_1 = __importDefault(require("../models/Like"));
const Message_1 = __importDefault(require("../models/Message"));
const Rooms_1 = __importDefault(require("../models/Rooms"));
const socket_1 = require("../sockets/socket");
const blockUserProfile = async (req, res, next) => {
    const { profileId, roomId } = req.body;
    const userId = req?.user?.id;
    if (!userId || !profileId || !roomId) {
        return res.status(400).json({ message: 'UserId, ProfileId, and RoomId are required' });
    }
    try {
        // Check if the user has already blocked this profile
        const existingBlockedUser = await BlockedUsers_1.default.findOne({ where: { userId, profileId } });
        if (existingBlockedUser) {
            // Delete all messages in the room
            await Message_1.default.destroy({ where: { room_id: roomId } });
            // Delete the room itself
            await Rooms_1.default.destroy({ where: { id: roomId } });
            return res.status(201).json({ message: 'You already blocked this profile' });
        }
        // Delete all messages in the room
        await Message_1.default.destroy({ where: { room_id: roomId } });
        // Delete the room itself
        await Rooms_1.default.destroy({ where: { id: roomId } });
        // Create a new block entry
        const blockedUser = await BlockedUsers_1.default.create({ userId, profileId });
        // Fetch the user's first and last name
        const user = await User_1.default.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Pass the first and last name to the notify function
        const userFullName = `${user.firstName} ${user.lastName}`;
        const message = `${userFullName} has blocked you.`;
        const blockedUserId = profileId; // ID of the user being blocked
        (0, socket_1.notifyAsBlocked)(userId, blockedUserId, message);
        res.status(201).json();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.blockUserProfile = blockUserProfile;
const unblockUserProfile = async (req, res, next) => {
    // Access profileId correctly from req.body
    const { profileId } = req.body.profileId ? req.body.profileId : req.body;
    const userId = req?.user?.id; // Ensure userId is a number
    // Log to verify values
    if (!userId || typeof profileId !== 'number') {
        return res.status(400).json({ message: 'UserId and ProfileId are required and should be valid numbers' });
    }
    try {
        // Find the block entry
        const blockedUser = await BlockedUsers_1.default.findOne({ where: { userId, profileId } });
        if (!blockedUser) {
            // If the block entry does not exist, return a response
            return res.status(404).json({ message: 'Block entry not found' });
        }
        // Remove the block entry
        await blockedUser.destroy();
        res.status(200).json({ message: 'Profile unblocked successfully' });
    }
    catch (error) {
        console.error('Error in unblockUserProfile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.unblockUserProfile = unblockUserProfile;
const getBlockedProfiles = async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        // Step 1: Fetch all blocked profiles for the current user with profile details
        const blockedProfiles = await BlockedUsers_1.default.findAll({
            where: { userId },
            include: [{ model: User_1.default, as: 'profile' }]
        });
        // Step 2: Map through blocked profiles and add `isLiked` field
        const blockedProfilesWithLikes = await Promise.all(blockedProfiles.map(async (blockedUser) => {
            // Check if the current user has liked this blocked profile
            const isLiked = await Like_1.default.findOne({
                where: {
                    userId: userId,
                    profileId: blockedUser.profile?.id
                }
            });
            return {
                ...blockedUser.profile?.toJSON(), // Convert profile to JSON
                isLiked: !!isLiked // `isLiked` will be true if a Like exists, otherwise false
            };
        }));
        // Respond with the list of blocked profiles including their `isLiked` status
        res.status(200).json(blockedProfilesWithLikes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getBlockedProfiles = getBlockedProfiles;
