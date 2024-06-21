import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import AppError from '../utils/AppError';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('You are not logged in! Please log in to get access.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { id: number };
    
    console.log(req,"llllllllllllllllllllllll");
    
    // Attach user ID to request object
    // req.user = { id: decoded.id };

    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
