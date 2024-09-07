import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import IgnoredUser from '../models/IgnoredUser';
import Like from '../models/Like';
import BlockedUsers from '../models/BlockedUsers';
interface AuthenticatedRequest extends Request {
    user?: { id: number };
}
export const ignoreUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { profileId } = req.body;
    let userId = req?.user?.id
    if (!userId || !profileId) {
        return res.status(400).json({ message: 'UserId and ProfileId are required' });
    }
    try {
        const existingIgnoredUser = await IgnoredUser.findOne({ where: { userId, profileId } });
        if (existingIgnoredUser) {
            await existingIgnoredUser.destroy();
            return res.status(201).json({ message: 'You already ignored this profile' });
        }
        const ignoredUser = await IgnoredUser.create({ userId, profileId });
        res.status(201).json(ignoredUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const getIgnoredUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?.id;
    
    try {
        // Step 1: Fetch all blocked profile IDs for the current user
        const blockedProfiles = await BlockedUsers.findAll({
            where: {
                userId: userId
            },
            attributes: ['profileId']
        });
        const blockedProfileIds = blockedProfiles.map(profile => profile.profileId);

        // Step 2: Fetch all ignored users for the current user with profile details
        const ignoreUsers = await IgnoredUser.findAll({
            where: { userId },
            include: [{ model: User, as: 'profile' }]
        });

        // Step 3: Map through ignored users, exclude blocked profiles, and add `isLiked` field
        const ignoredUsersWithLikes = await Promise.all(ignoreUsers.map(async (ignoredUser) => {
            const profile = ignoredUser.profile;

            if (!profile || blockedProfileIds.includes(profile.id)) {
                // Skip blocked profiles or undefined profiles
                return null;
            }

            const isLiked = await Like.findOne({
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

        // Step 4: Filter out null values (profiles that were blocked or undefined)
        const filteredIgnoredUsers = ignoredUsersWithLikes.filter(user => user !== null);

        // Step 5: Return the list of ignored users with the `isLiked` field
        res.status(200).json(filteredIgnoredUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
