
import { Request, Response, NextFunction } from 'express';
import BlockedUsers from '../models/BlockedUsers';

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}
export const blockUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { profileId } = req.body;
    const userId = req?.user?.id;

    if (!userId || !profileId) {
        return res.status(400).json({ message: 'UserId and ProfileId are required' });
    }

    try {
        // Check if the user has already blocked this profile
        const existingBlockedUser = await BlockedUsers.findOne({ where: { userId, profileId } });

        if (existingBlockedUser) {
            // If the user has already blocked this profile, return a response
            return res.status(201).json({ message: 'You already blocked this profile' });
        }

        // Create a new block entry
        const blockedUser = await BlockedUsers.create({ userId, profileId });
        res.status(201).json(blockedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const unblockUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { profileId } = req.body;
    const userId = req?.user?.id;

    if (!userId || !profileId) {
        return res.status(400).json({ message: 'UserId and ProfileId are required' });
    }

    try {
        // Find the block entry
        const blockedUser = await BlockedUsers.findOne({ where: { userId, profileId } });

        if (!blockedUser) {
            // If the block entry does not exist, return a response
            return res.status(404).json({ message: 'Block entry not found' });
        }

        // Remove the block entry
        await blockedUser.destroy();
        res.status(200).json({ message: 'Profile unblocked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};