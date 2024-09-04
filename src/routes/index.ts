import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
const router = Router();
router.get('/',authMiddleware, (req, res) => {
  res.json({ message: 'Hello, world!' });
});
export default router;
