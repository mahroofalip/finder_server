import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { getFinderUsers } from '../controllers/usersController';

const router = Router();

router.get('/getUsers', authMiddleware, getFinderUsers);



export default router;