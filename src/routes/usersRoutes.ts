import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { getFinderUsers, getMe, getProfile, UpdateActiveInactive, updateUserProfile } from '../controllers/usersController';

const router = Router();

router.get('/getUsers', authMiddleware, getFinderUsers);
router.get('/getMe', authMiddleware, getMe);
router.put('/update-user', authMiddleware, updateUserProfile);  // New route for updating user profile
router.get('/update-online', authMiddleware, UpdateActiveInactive);  // New route for updating user profile
router.get('/profile/:profileId', authMiddleware, getProfile);



export default router;
