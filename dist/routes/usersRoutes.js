"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const usersController_1 = require("../controllers/usersController");
const blockUserController_1 = require("../controllers/blockUserController");
const router = (0, express_1.Router)();
router.get('/getUsers', authMiddleware_1.default, usersController_1.getKizzoraUsers);
router.get('/getMe', authMiddleware_1.default, usersController_1.getMe);
router.put('/update-user', authMiddleware_1.default, usersController_1.updateUserProfile); // New route for updating user profile
router.get('/update-online', authMiddleware_1.default, usersController_1.UpdateActiveInactive); // New route for updating user profile
router.get('/profile/:profileId', authMiddleware_1.default, usersController_1.getProfile);
router.put('/block-profile', authMiddleware_1.default, blockUserController_1.blockUserProfile); // New route for updating user profile
router.put('/unblock-profile', authMiddleware_1.default, blockUserController_1.unblockUserProfile); // New route for updating user profile
router.get('/get-blocked-profies', authMiddleware_1.default, blockUserController_1.getBlockedProfiles); // New route for updating user profile
exports.default = router;
