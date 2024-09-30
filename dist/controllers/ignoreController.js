"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIgnoredUser = exports.ignoreUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const IgnoredUser_1 = __importDefault(require("../models/IgnoredUser"));
const Like_1 = __importDefault(require("../models/Like"));
const BlockedUsers_1 = __importDefault(require("../models/BlockedUsers"));
const Rooms_1 = __importDefault(require("../models/Rooms"));
const sequelize_1 = require("sequelize");
const ignoreUser = async (req, res, next) => {
    const { profileId } = req.body;
    let userId = req?.user?.id;
    if (!userId || !profileId) {
        return res.status(400).json({ message: 'UserId and ProfileId are required' });
    }
    try {
        const existingIgnoredUser = await IgnoredUser_1.default.findOne({ where: { userId, profileId } });
        if (existingIgnoredUser) {
            await existingIgnoredUser.destroy();
            return res.status(201).json({ message: 'You already ignored this profile' });
        }
        const ignoredUser = await IgnoredUser_1.default.create({ userId, profileId });
        res.status(201).json(ignoredUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.ignoreUser = ignoreUser;
const getIgnoredUser = async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        // Step 1: Fetch all blocked profile IDs for the current user
        const blockedProfiles = await BlockedUsers_1.default.findAll({
            where: {
                userId: userId
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
        // Step 3: Fetch all ignored users for the current user with profile details
        const ignoreUsers = await IgnoredUser_1.default.findAll({
            where: { userId },
            include: [{ model: User_1.default, as: 'profile' }]
        });
        // Step 4: Map through ignored users, exclude blocked profiles and users connected via rooms, and add `isLiked` field
        const ignoredUsersWithLikes = await Promise.all(ignoreUsers.map(async (ignoredUser) => {
            const profile = ignoredUser.profile;
            if (!profile || blockedProfileIds.includes(profile.id) || roomUserIds.includes(profile.id)) {
                // Skip blocked profiles, connected room users, or undefined profiles
                return null;
            }
            const isLiked = await Like_1.default.findOne({
                where: {
                    userId: userId,
                    profileId: profile.id
                }
            });
            return {
                ...profile.toJSON(),
                isLiked: !!isLiked // `isLiked` will be true if a Like exists, otherwise false
            };
        }));
        // Step 5: Filter out null values (profiles that were blocked, connected via rooms, or undefined)
        const filteredIgnoredUsers = ignoredUsersWithLikes.filter(user => user !== null);
        // Step 6: Return the list of ignored users with the `isLiked` field
        res.status(200).json(filteredIgnoredUsers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getIgnoredUser = getIgnoredUser;