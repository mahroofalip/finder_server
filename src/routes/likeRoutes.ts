import { Router } from 'express';
import { addLike, getLikesForUser } from '../controllers/likeController';
import authMiddleware from '../middleware/authMiddleware';
const router = Router();
router.post('/addlike', authMiddleware, addLike);
router.get('/getlikeuser', authMiddleware, getLikesForUser);
export default router;
