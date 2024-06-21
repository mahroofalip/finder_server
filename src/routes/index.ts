// src/routes/index.ts
import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// Add any general routes here
router.get('/',authMiddleware, (req, res) => {
  res.json({ message: 'Hello, world!' });
});

export default router;
