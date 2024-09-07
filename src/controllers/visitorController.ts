import { NextFunction, Request, Response } from 'express';
import Visitors from '../models/Visitors';
import User from '../models/User';
import Like from '../models/Like';
import { Op } from 'sequelize';
import { LikeAttributes } from '../types/like';
import BlockedUsers from '../models/BlockedUsers';
import Room from '../models/Rooms';

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}

// Add a visitor
export const addVisitor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { profileId } = req.body;
    let userId = req?.user?.id;

    if (!userId || !profileId) {
        return res.status(400).json({ message: 'UserId and ProfileId are required' });
    }

    try {
        // Check if the user has already visited this profile
        const existingVisit = await Visitors.findOne({ where: { userId, profileId } });

        if (existingVisit) {
            return res.status(201).json({ message: 'You have already visited this profile' });
        }

        // Create a new visitor record
        const visitor = await Visitors.create({ userId, profileId });

        res.status(201).json(visitor);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getVisitorsForUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        // Step 1: Fetch all blocked profile IDs for the current user
        const blockedProfiles = await BlockedUsers.findAll({
            where: {
                userId: userId // Only profiles that this user has blocked
            },
            attributes: ['profileId']
        });
        const blockedProfileIds = blockedProfiles.map(profile => profile.profileId);

        // Step 2: Fetch all visits where the current user is the profile owner
        const visits = await Visitors.findAll({
            where: { profileId: userId },
            include: [{ model: User, as: 'user' }]
        });

        // Extract IDs of the profiles that have visited the user and filter out blocked profiles
        const visitedProfileIds = visits
            .map(visit => visit.user?.id)
            .filter((id): id is number => id !== undefined && !blockedProfileIds.includes(id)); // Exclude blocked users

        // Step 3: Fetch the liked profiles of the current user
        const likedProfiles = await Like.findAll({
            where: {
                userId: userId,
                profileId: {
                    [Op.in]: visitedProfileIds // Ensure no `undefined` values are present
                }
            },
            attributes: ['profileId']
        });

        const likedProfileIds = likedProfiles.map((profile: LikeAttributes) => profile.profileId);

        // Step 4: Fetch all rooms where the current user is either sender or receiver
        const rooms = await Room.findAll({
            where: {
                [Op.or]: [
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
        }, [] as number[]);

        // Step 5: Add `isVisited` and `isLiked` fields to each visiting user, and exclude users with a room
        const visitingUsersWithStatus = await Promise.all(visits.map(async (visit) => {
            const user = visit.user;
            if (!user || blockedProfileIds.includes(user.id) || roomUserIds.includes(user.id)) {
                // Exclude blocked users and those connected through a room
                return null;
            }

            // Check if the current user has visited this user back
            const isVisited = await Visitors.findOne({
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
            if (a?.isLiked === b?.isLiked) return 0;
            return a?.isLiked ? 1 : -1;
        });

        res.status(200).json(sortedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};