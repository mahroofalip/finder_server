
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import EyeColor from '../models/EyeColor';

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}



export const getFinderUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        console.log("////////////////////", req.body);

        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const userId = req.user.id;
        const users = await User.findAll();
        console.log(users, "users");

        res.status(200).send(users);
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const user = await User.findOne({ where: { id: req.user?.id } });
        console.log(user, "user");

        res.status(200).json({
            status: 'success',
            user,
            message: "User Profile Successfully Fetched",
        });

    } catch (error) {
        next(error);
    }
};