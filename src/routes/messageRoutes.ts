import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import {  getUserChats, createRoomAndSendMessage, getMessagesByRoomId, createNewMessage,  } from '../controllers/messageController';
const router = Router();
router.post('/createRoomAndSendMessage', authMiddleware, createRoomAndSendMessage);
router.get('/getUserChats', authMiddleware, getUserChats);
router.post('/getMessagesByRoomId', authMiddleware,getMessagesByRoomId );
router.post('/createNewMessage', authMiddleware,createNewMessage);
export default router;