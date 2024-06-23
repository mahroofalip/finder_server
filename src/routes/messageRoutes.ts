import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import {  getUserChats, createRoomAndSendMessage } from '../controllers/messageController';

const router = Router();

router.post('/createRoomAndSendMessage', authMiddleware, createRoomAndSendMessage);
router.get('/getUserChats', authMiddleware, getUserChats);
// router.post('/messagedFriends', authMiddleware, messagedFriends);



export default router;