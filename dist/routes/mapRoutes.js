"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const mapController_1 = require("../controllers/mapController");
const router = (0, express_1.Router)();
router.get('/places', authMiddleware_1.default, mapController_1.getPlaces);
exports.default = router;
