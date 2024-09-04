    import { Router } from 'express';
    import authMiddleware from '../middleware/authMiddleware';
    import {  getPlaces } from '../controllers/mapController';
    const router = Router();
    router.get('/places', authMiddleware, getPlaces);
    export default router;
