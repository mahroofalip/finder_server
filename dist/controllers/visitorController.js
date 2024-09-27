"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisitorsForUser = exports.addVisitor = void 0;
const Visitors_1 = __importDefault(require("../models/Visitors"));
const User_1 = __importDefault(require("../models/User"));
const Like_1 = __importDefault(require("../models/Like"));
const sequelize_1 = require("sequelize");
const BlockedUsers_1 = __importDefault(require("../models/BlockedUsers"));
const Rooms_1 = __importDefault(require("../models/Rooms"));
// Add a visitor
const addVisitor = async (req, res, next) => {
    const { profileId } = req.body;
    let userId = req?.user?.id;
    if (!userId || !profileId) {
        return res.status(400).json({ message: 'UserId and ProfileId are required' });
    }
    try {
        // Check if the user has already visited this profile
        const existingVisit = await Visitors_1.default.findOne({ where: { userId, profileId } });
        if (existingVisit) {
            return res.status(201).json({ message: 'You have already visited this profile' });
        }
        // Create a new visitor record
        const visitor = await Visitors_1.default.create({ userId, profileId });
        res.status(201).json(visitor);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.addVisitor = addVisitor;
const getVisitorsForUser = async (req, res, next) => {
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
        // Step 2: Fetch all visits where the current user is the profile owner
        const visits = await Visitors_1.default.findAll({
            where: { profileId: userId },
            include: [{ model: User_1.default, as: 'user' }]
        });
        // Extract IDs of the profiles that have visited the user and filter out blocked profiles
        const visitedProfileIds = visits
            .map(visit => visit.user?.id)
            .filter((id) => id !== undefined && !blockedProfileIds.includes(id)); // Exclude blocked users
        // Step 3: Fetch the liked profiles of the current user
        const likedProfiles = await Like_1.default.findAll({
            where: {
                userId: userId,
                profileId: {
                    [sequelize_1.Op.in]: visitedProfileIds // Ensure no `undefined` values are present
                }
            },
            attributes: ['profileId']
        });
        const likedProfileIds = likedProfiles.map((profile) => profile.profileId);
        // Step 4: Fetch all rooms where the current user is either sender or receiver
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
        // Step 5: Add `isVisited` and `isLiked` fields to each visiting user, and exclude users with a room
        const visitingUsersWithStatus = await Promise.all(visits.map(async (visit) => {
            const user = visit.user;
            if (!user || blockedProfileIds.includes(user.id) || roomUserIds.includes(user.id)) {
                // Exclude blocked users and those connected through a room
                return null;
            }
            // Check if the current user has visited this user back
            const isVisited = await Visitors_1.default.findOne({
                where: {
                    userId: userId,
                    profileId: user.id
                }
            });
            // Check if the current user has liked this user
            const isLiked = likedProfileIds.includes(user.id);
            return {
                ...user.toJSON(),
                isVisited: !!isVisited,
                isLiked
            };
        }));
        // Step 6: Filter out null values (if any)
        const filteredVisitingUsers = visitingUsersWithStatus.filter(user => user !== null);
        // Step 7: Sort users so that liked profiles are at the end of the list
        const sortedUsers = filteredVisitingUsers.sort((a, b) => {
            if (a?.isLiked === b?.isLiked)
                return 0;
            return a?.isLiked ? 1 : -1;
        });
        res.status(200).json(sortedUsers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.getVisitorsForUser = getVisitorsForUser;
