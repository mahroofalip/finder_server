import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { addVisitor, getVisitorsForUser } from '../controllers/visitorController';
const router = Router();
router.post('/add-visitor', authMiddleware, addVisitor);
router.get('/get-visitorUser', authMiddleware, getVisitorsForUser);
export default router;
