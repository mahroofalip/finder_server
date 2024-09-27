"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const ignoreController_1 = require("../controllers/ignoreController");
const router = (0, express_1.Router)();
router.post('/ignoreUser', authMiddleware_1.default, ignoreController_1.ignoreUser);
router.get('/getIgnoredUser', authMiddleware_1.default, ignoreController_1.getIgnoredUser);
exports.default = router;
