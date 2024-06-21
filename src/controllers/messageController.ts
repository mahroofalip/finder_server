import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import AppError from '../utils/AppError';
import { generateToken } from '../utils/jwt';
import { hashPassword } from '../utils/password';
import { notifyUser } from '../sockets/socket';






export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {


    } catch (error) {
        next(error);
    }
};



export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { room, message } = req.body;
        notifyUser(room, message);
        res.status(200).send({ room, message });
    } catch (error) {
        next(error);
    }
};



export const messagedFriends = async (req: Request, res: Response, next: NextFunction) => {
    try {


    } catch (error) {
        next(error);
    }
};