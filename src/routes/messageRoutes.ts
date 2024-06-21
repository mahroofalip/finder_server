import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import {  getUserChats, sendMessage } from '../controllers/messageController';

const router = Router();

router.post('/sendMessage', authMiddleware, sendMessage);
router.get('/getUserChats', authMiddleware, getUserChats);
// router.post('/messagedFriends', authMiddleware, messagedFriends);



export default router;