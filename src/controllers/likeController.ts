import { NextFunction, Request, Response } from 'express';
import Like from '../models/Like';
import User from '../models/User';
import BlockedUsers from '../models/BlockedUsers';
interface AuthenticatedRequest extends Request {
    user?: { id: number };
}
// Add a like
export const addLike = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { profileId } = req.body;
    let userId = req?.user?.id
    if (!userId || !profileId) {
        return res.status(400).json({ message: 'UserId and ProfileId are required' });
    }

    try {
        const existingLike = await Like.findOne({ where: { userId, profileId } });

        if (existingLike) {
            await existingLike.destroy();
            return res.status(201).json({ message: 'You already liked this profile' });
        }
        const like = await Like.create({ userId, profileId });

        res.status(201).json(like);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all likes for a user
export const getLikesForUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?.id;

    try {
        // Step 1: Fetch all blocked profile IDs
        const blockedProfiles = await BlockedUsers.findAll({
            where: {
                userId: userId, // Only profiles that this user has blocked
            },
            attributes: ['profileId']
        });
        const blockedProfileIds = blockedProfiles.map(profile => profile.profileId);

        // Step 2: Fetch all likes where the current user's profileId is liked by others
        const likes = await Like.findAll({
            where: { profileId: userId },
            include: [{ model: User, as: 'user' }] // Include the user who liked the current user's profile
        });

        // Step 3: Extract the liked users and check if the current user liked them back
        const likedUsersWithIsLiked = await Promise.all(likes.map(async (like) => {
            const user = like.user;
            if (!user || blockedProfileIds.includes(user.id)) {
                // Skip if the user is blocked or undefined
                return null;
            }

            // Check if the current user has liked this user back
            const isLiked = await Like.findOne({
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

        // Step 4: Filter out any null values (cases where like.user was undefined or blocked)
        const filteredLikedUsers = likedUsersWithIsLiked.filter(user => user !== null);

        res.status(200).json(filteredLikedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

