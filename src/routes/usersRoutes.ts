import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { getFinderUsers, getMe } from '../controllers/usersController';

const router = Router();

router.get('/getUsers', authMiddleware, getFinderUsers);
router.get('/getMe',authMiddleware, getMe);



export default router;