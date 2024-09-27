"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const optionsController_1 = require("../controllers/optionsController");
const router = (0, express_1.Router)();
router.get('/genders-list', authMiddleware_1.default, optionsController_1.getGenders);
router.get('/education-list', authMiddleware_1.default, optionsController_1.getEducation);
router.get('/profession-list', authMiddleware_1.default, optionsController_1.getProfession);
router.get('/eye-color-list', authMiddleware_1.default, optionsController_1.getEyeColor);
router.get('/hair-color-list', authMiddleware_1.default, optionsController_1.getHairColor);
router.get('/interests-list', authMiddleware_1.default, optionsController_1.getinterests);
exports.default = router;
