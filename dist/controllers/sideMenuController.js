"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSidebarMenuItems = void 0;
const SideMenu_1 = __importDefault(require("../models/SideMenu")); // Adjust import path as necessary
const getAllSidebarMenuItems = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const menuItems = await SideMenu_1.default.findAll({
            where: { isEnabled: true }, // Only return items where isEnabled is true
            order: [['id', 'ASC']], // Optional: Order by ID or any other field
        });
        res.status(200).json(menuItems);
    }
    catch (error) {
        console.error('Error fetching sidebar menu items:', error);
        next(error);
    }
};
exports.getAllSidebarMenuItems = getAllSidebarMenuItems;
