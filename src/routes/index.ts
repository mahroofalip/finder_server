// src/routes/index.ts
import { Router } from 'express';

const router = Router();

// Add any general routes here
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

export default router;
