import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { getFinderUsers, getMe, getProfile, UpdateActiveInactive, updateUserProfile } from '../controllers/usersController';
import { blockUserProfile } from '../controllers/blockUserController';

const router = Router();

router.get('/getUsers', authMiddleware, getFinderUsers);
router.get('/getMe', authMiddleware, getMe);
router.put('/update-user', authMiddleware, updateUserProfile);  // New route for updating user profile
router.get('/update-online', authMiddleware, UpdateActiveInactive);  // New route for updating user profile
router.get('/profile/:profileId', authMiddleware, getProfile);
router.put('/block-profile', authMiddleware, blockUserProfile);  // New route for updating user profile



export default router;
