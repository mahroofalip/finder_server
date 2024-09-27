"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const visitorController_1 = require("../controllers/visitorController");
const router = (0, express_1.Router)();
router.post('/add-visitor', authMiddleware_1.default, visitorController_1.addVisitor);
router.get('/get-visitorUser', authMiddleware_1.default, visitorController_1.getVisitorsForUser);
exports.default = router;
