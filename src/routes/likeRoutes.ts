import { Router } from 'express';
import { addLike, removeLike, getLikesForUser } from '../controllers/likeController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/addlike', authMiddleware, addLike);
router.delete('/removeLike', authMiddleware, removeLike);
router.get('/getlikeuser', authMiddleware, getLikesForUser);

export default router;
