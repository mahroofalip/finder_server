// src/routes/userRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Example of a protected route
router.get('/profile', authMiddleware, (req, res) => {
    res.send('This is a protected route');
});

export default router;