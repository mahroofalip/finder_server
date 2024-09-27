"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeOldVisitorRecordsJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const sequelize_1 = require("sequelize");
const Visitors_1 = __importDefault(require("../models/Visitors"));
exports.removeOldVisitorRecordsJob = node_cron_1.default.schedule('0 0 * * *', async () => {
    try {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Calculate the date two days ago
        // Delete visitor records older than two days
        await Visitors_1.default.destroy({
            where: {
                createdAt: {
                    [sequelize_1.Op.lt]: twoDaysAgo, // Compare with the createdAt timestamp
                },
            }, // Casting to any to bypass TypeScript's type checking
        });
    }
    catch (error) {
        console.error('Error removing old visitor records:', error);
    }
});
