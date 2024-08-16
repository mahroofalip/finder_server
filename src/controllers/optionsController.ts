


import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import EyeColor from '../models/EyeColor';
import Gender from '../models/Gender';
import Education from '../models/Education';
import Profession from '../models/Profession';
import HairColor from '../models/HairColor';

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}

export const getGenders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // console.log("//////////////////// getGenders");

        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const genders = await Gender.findAll();
        // console.log(genders, "users");

        res.status(200).send(genders);
    } catch (error) {
        next(error);
    }
};

export const getEducation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // console.log("//////////////////// getEducation");

        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const education = await Education.findAll();
        // console.log(education, "education");

        res.status(200).send(education);
    } catch (error) {
        next(error);
    }
};


export const getProfession = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // console.log("//////////////////// getProfession");

        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const profession = await Profession.findAll();
        // console.log(profession, "profession");

        res.status(200).send(profession);
    } catch (error) {
        next(error);
    }
};


export const getHairColor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // console.log("//////////////////// getHairColor");

        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const hairColor = await HairColor.findAll();
        // console.log(hairColor, "hairColor");

        res.status(200).send(hairColor);
    } catch (error) {
        next(error);
    }
};

export const getEyeColor = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // console.log("//////////////////// getEyeColor");

        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const eyeColor = await EyeColor.findAll();
        // console.log(eyeColor, "eyeColor");

        res.status(200).send(eyeColor);
    } catch (error) {
        next(error);
    }
};