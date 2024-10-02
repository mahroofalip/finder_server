import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import AppError from './utils/AppError';
import errorHandler from './middleware/errorHandler';
dotenv.config();

const app = express();

// Middleware setup
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '500mb' })); // Set limit here
app.use(express.urlencoded({ limit: '500mb', extended: true })); // Set limit here
app.use(express.static(path.join(__dirname, '../public')));

// Routes
import apiRoutes from './routes';
import authRoutes from './routes/authRoutes'; 
import menuRoutes from './routes/sideMenuRoutes';
import messageRoutes from './routes/messageRoutes';
import usersRoutes from './routes/usersRoutes';
import mapRoutes from './routes/mapRoutes';
import commonRoutes from './routes/commonRoutes';
import likeRoutes from './routes/likeRoutes';
import ignoreRoutes from './routes/ignoreRoutes';
import visitorRoute from './routes/visitorRoutes';

app.get('/', (req, res) => {
  res.send('App server is working ...');
});

app.use('/api', apiRoutes);
app.use('/api/sidemenu', menuRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/map', mapRoutes); 
app.use('/api/common', commonRoutes); 
app.use('/api/like', likeRoutes); 
app.use('/api/ignore', ignoreRoutes); 
app.use('/api/visitor', visitorRoute); 

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});
app.use(errorHandler);

export default app;
