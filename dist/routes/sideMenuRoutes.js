"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const sideMenuController_1 = require("../controllers/sideMenuController");
const router = (0, express_1.Router)();
router.get('/get-side-menu', authMiddleware_1.default, sideMenuController_1.getAllSidebarMenuItems);
exports.default = router;
