import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import AppError from './utils/AppError';
import errorHandler from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
import apiRoutes from './routes';
import userRoutes from './routes/userRoutes';

app.use('/api', apiRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(errorHandler);

export default app;
