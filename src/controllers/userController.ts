import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import AppError from '../utils/AppError';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/password';


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { email, password, phone, firstName, lastName } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      res.status(401).json({
        status: 'exist',
        message: "User already exists",
        user: null
      });
      return
    } else {

      const hashedPassword = await hashPassword(password);
      const newUser = await User.create({ email, password: hashedPassword, phone, firstName, lastName });
  
      const token = generateToken(newUser.id);
  
      res.status(200).json({
        status: 'success',
        token,
        user: newUser
      });
  
    }


  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    console.log(req.body,"req.body");
    
    // sugu@gmail.in
    if (!email || !password) {
      throw new AppError('All fields are required', 400);
    }

    const user = await User.findOne({ where: { email } });
    // h@gmail.in

    console.log(user,"h@gmail.in");
    let check = await user?.comparePassword(password)
    console.log(check,"check");
    
    if (!user || !(check)) {
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
