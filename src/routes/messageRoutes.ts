import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { getMessages, messagedFriends, sendMessage } from '../controllers/messageController';

const router = Router();

router.post('/sendMessage', authMiddleware, sendMessage);
router.get('/getMessages', authMiddleware, getMessages);
router.post('/messagedFriends', authMiddleware, messagedFriends);



export default router;