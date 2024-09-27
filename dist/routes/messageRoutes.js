"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const messageController_1 = require("../controllers/messageController");
const router = (0, express_1.Router)();
router.post('/createRoomAndSendMessage', authMiddleware_1.default, messageController_1.createRoomAndSendMessage);
router.get('/getUserChats', authMiddleware_1.default, messageController_1.getUserChats);
router.post('/getMessagesByRoomId', authMiddleware_1.default, messageController_1.getMessagesByRoomId);
router.post('/createNewMessage', authMiddleware_1.default, messageController_1.createNewMessage);
exports.default = router;
