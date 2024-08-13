import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { getEducation, getEyeColor, getGenders, getHairColor, getProfession } from '../controllers/optionsController';
const router = Router();

// Route for Google Places Autocomplete API
router.get('/genders-list', authMiddleware, getGenders);
router.get('/education-list', authMiddleware, getEducation);
router.get('/profession-list', authMiddleware, getProfession);
router.get('/eye-color-list', authMiddleware, getEyeColor);
router.get('/hair-color-list', authMiddleware, getHairColor);




export default router;
