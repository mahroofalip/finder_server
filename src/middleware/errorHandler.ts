// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Set default values if they don't exist
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

export default errorHandler;
