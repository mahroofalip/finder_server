import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { getAllSidebarMenuItems } from '../controllers/sideMenuController';
const router = Router();
router.get('/get-side-menu', authMiddleware, getAllSidebarMenuItems);

export default router;