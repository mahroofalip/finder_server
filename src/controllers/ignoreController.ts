import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import IgnoredUser from '../models/IgnoredUser';
interface AuthenticatedRequest extends Request {
    user?: { id: number };
}
// Add a ignoredUser
export const ignoreUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log(req.body, "req.bodyreq.body");
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


// Get all ignoreduser for a user
export const getIgnoredUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req?.user?.id;

    try {
        // Fetch all ignoredUser for the userId and include the associated profile
        const ignoreUsers = await IgnoredUser.findAll({
            where: { userId }, // Fetching ignored profiles for the current user
            include: [{ model: User, as: 'profile' }] // Include the profile associated with the ignoredUser
        });

        // Extract the ignored profiles from the results and filter out undefined values
        const ignoredUsers = ignoreUsers
            .map(ignoredUser => ignoredUser.profile)
            .filter(profile => profile !== undefined);

        console.log(ignoredUsers, "ignoredUsers");

        // If the array is empty or contains only undefined, return an empty array
        res.status(200).json(ignoredUsers.length > 0 ? ignoredUsers : []);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
