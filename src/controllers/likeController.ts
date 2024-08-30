import { NextFunction, Request, Response } from 'express';
import Like from '../models/Like';
import User from '../models/User';
interface AuthenticatedRequest extends Request {
    user?: { id: number };
}
// Add a like
export const addLike = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log(req.body, "req.bodyreq.body");
    const { profileId } = req.body;
    let userId = req?.user?.id
    if (!userId || !profileId) {
        return res.status(400).json({ message: 'UserId and ProfileId are required' });
    }

    try {
        const existingLike = await Like.findOne({ where: { userId, profileId } });

        if (existingLike) {
            return res.status(400).json({ message: 'You already liked this profile' });
        }
        const like = await Like.create({ userId, profileId });

        res.status(201).json(like);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Remove a like
export const removeLike = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const {  profileId } = req.body;

    let userId = req?.user?.id
    if (!userId || !profileId) {
        return res.status(400).json({ message: 'UserId and ProfileId are required' });
    }

    try {
        const like = await Like.findOne({ where: { userId, profileId } });

        if (!like) {
            return res.status(404).json({ message: 'Like not found' });
        }

        await like.destroy();
        res.status(200).json({ message: 'Like removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get all likes for a user
export const getLikesForUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId =  req?.user?.id
    ;

    try {
        // Fetch all likes for the profileId and include the associated user
        const likes = await Like.findAll({
            where: { profileId:userId },
            include: [{ model: User, as: 'user' }] // Include the user associated with the like
        });

        // Extract the liked users from the results
        const likedUsers = likes.map(like => like.user);

        res.status(200).json(likedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
