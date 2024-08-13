
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import EyeColor from '../models/EyeColor';

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}



export const getFinderUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

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


export const updateUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }

        const userId = req.user.id;
        const {
            eyeColor,
            hairColor,
            education,
            gender,
            profession,
            displayName,
            firstName,
            lastName,
            maritalStatus,
            dob,
            profileImage,
            userName,
            height,
            weight,
            place,
            description,
        } = req.body;
        let placeDis = place.description;

        console.log(req.body, "req.body");


        const updatedUser = await User.update(
            {
                firstName,
                lastName,
                maritalStatus,
                profileImage,
                description,
                userName,
                height,
                weight,
                eyeColor,
                hairColor,
                education,
                gender,
                profession,
                displayName,
                place: placeDis,
                birthDate: dob
            },
            {
                where: { id: userId },
                returning: true,
            }
        );

        if (updatedUser[0] === 0) {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }

        res.status(200).json({
            status: 'success',
            user: updatedUser[1][0],  
            message: "User Profile Successfully Updated",
        });

    } catch (error) {
        next(error);
    }
};