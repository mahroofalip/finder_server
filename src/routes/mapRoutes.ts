import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import {  getPlaces } from '../controllers/mapController';
const router = Router();

// Route for Google Places Autocomplete API
router.get('/places', authMiddleware, getPlaces);


export default router;
