import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import AppError from '../utils/AppError';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, phone } = req.body;

    if (!email || !password || !phone) {
      throw new AppError('All fields are required', 400);
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      throw new AppError('User already exists', 400);
    }

    const newUser = await User.create({ email, password, phone });

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('All fields are required', 400);
    }

    const user = await User.findOne({ where: { email, password } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};
