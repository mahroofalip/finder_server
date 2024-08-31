import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { getIgnoredUser, ignoreUser } from '../controllers/ignoreController';


const router = Router();

router.post('/ignoreUser', authMiddleware, ignoreUser);
router.get('/getIgnoredUser', authMiddleware, getIgnoredUser);

export default router;
