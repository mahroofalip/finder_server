import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import AppError from '../utils/AppError';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // console.log('llllllllllllllllllll');
  // console.log(req.body,"lllllllllllllgggg");
  
  
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('You are not logged in! Please log in to get access.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { id: number };

    req.user = decoded; // Attach the decoded token to the req object
    next(); // Call the next middleware function
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

export default authMiddleware;
