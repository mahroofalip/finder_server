import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import AppError from '../utils/AppError';
import { generateToken } from '../utils/jwt';
import { generateUniqueUsername } from '../utils/usernameGenerator';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, phone, firstName, lastName } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      res.status(401).json({
        status: 'exist',
        message: "User already exists",
        user: null,
      });
      return;
    } else {
      // Generate a unique username
      const uniqueUsername = await generateUniqueUsername();

      // Create a new user
      const newUser = await User.create({
        email,
        password: password, // Ideally, hash the password before storing it
        phone,
        firstName,
        lastName,
        isOnline: false,
        profileImage: 'https://picsum.photos/seed/picsum/200/300',
        userName: uniqueUsername, // Use the generated unique username
        birthDate: null,
        height: null,
        weight: null,
        maritalStatus: null,
      });

      const token = generateToken(newUser.id);

      res.status(200).json({
        status: 'success',
        token,
        user: newUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Login function
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('All fields are required', 400);
    }

    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
      message: "User Login completed Successfully",
      user
    });
  } catch (error) {
    next(error);
  }
};
