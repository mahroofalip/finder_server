"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserActivity = exports.updateOnlineStatusJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const sequelize_1 = require("sequelize");
const User_1 = __importDefault(require("../models/User"));
exports.updateOnlineStatusJob = node_cron_1.default.schedule('* * * * *', async () => {
    try {
        const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
        User_1.default.update({ isOnline: false }, {
            where: {
                isOnline: true,
                lastActiveAt: {
                    [sequelize_1.Op.lt]: oneMinuteAgo, // Compare with lastActiveAt
                },
            },
        });
    }
    catch (error) {
        console.error('Error updating user online status:', error);
    }
});
async function updateUserActivity(userId, status) {
    User_1.default.update({ lastActiveAt: new Date(), isOnline: status }, // Update the lastActiveAt timestamp and set isOnline to true
    {
        where: {
            id: userId,
        },
    });
}
exports.updateUserActivity = updateUserActivity;
