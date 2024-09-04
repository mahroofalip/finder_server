import { NextFunction, Request, Response } from 'express';
import Visitors from '../models/Visitors';
import User from '../models/User';
import Like from '../models/Like';
import { Op } from 'sequelize';
import { LikeAttributes } from '../types/like';

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}

// Add a visitor
export const addVisitor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log(req.body, "req.bodyreq.body");
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
    const userId = req?.user?.id;
    console.log(userId, "userIduserIduserIduserIduserId");

    try {
        // Fetch all visits where the current user is the profile owner
        const visits = await Visitors.findAll({
            where: { profileId: userId },
            include: [{ model: User, as: 'user' }]
        });

        // Extract IDs of the profiles that have visited the user
        const visitedProfileIds = visits.map(visit => visit.user?.id).filter((id): id is number => id !== undefined);

        // Fetch the liked profiles of the current user
        const likedProfiles = await Like.findAll({
            where: {
                userId: userId,
                profileId: {
                    [Op.in]: visitedProfileIds // Ensure no `undefined` values are present
                }
            },
            attributes: ['profileId']
        });

        // Explicitly type the parameter in the map function
        const likedProfileIds = likedProfiles.map((profile: LikeAttributes) => profile.profileId);

        // Add `isVisited` and `isLiked` fields to each visiting user
        const visitingUsersWithStatus = await Promise.all(visits.map(async (visit) => {
            const user = visit.user;
            if (!user) {
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

        // Filter out null values (if any)
        const filteredVisitingUsers = visitingUsersWithStatus.filter(user => user !== null);

        // Sort users so that liked profiles are at the end of the list
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