import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import IgnoredUser from '../models/IgnoredUser';
import Like from '../models/Like';
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
        // Step 1: Fetch all ignored users for the current user with profile details
        const ignoreUsers = await IgnoredUser.findAll({
            where: { userId },
            include: [{ model: User, as: 'profile' }] 
        });

        // Step 2: Map through ignored users and add `isLiked` field
        const ignoredUsersWithLikes = await Promise.all(ignoreUsers.map(async (ignoredUser) => {
            const isLiked = await Like.findOne({
                where: {
                    userId: userId,
                    profileId: ignoredUser.profile?.id
                }
            });

            return {
                ...ignoredUser.profile?.toJSON(),
                isLiked: !!isLiked // `isLiked` will be true if a Like exists, otherwise false
            };
        }));

        // Step 3: Return the list of ignored users with the `isLiked` field
        res.status(200).json(ignoredUsersWithLikes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
