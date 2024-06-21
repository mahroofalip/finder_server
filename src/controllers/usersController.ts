
import { Op } from 'sequelize';
import Room from '../models/Rooms';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}



export const getFinderUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        console.log("////////////////////",req.body);
        
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