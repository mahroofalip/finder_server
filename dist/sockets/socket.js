"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyRoom = exports.notifyAsBlocked = exports.notifyUser = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
let io;
// Initialize Socket.IO
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*", // Allow any origin
            credentials: true, // If you're using credentials such as cookies
        },
    });
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
exports.initSocket = initSocket;
// Notify all connected clients
const notifyUser = (message, senderId) => {
    if (io) {
        io.emit('receive-message', { ...message, senderId });
    }
    else {
        console.error('Socket.IO not initialized');
    }
};
exports.notifyUser = notifyUser;
// Notify a specific user about being blocked
const notifyAsBlocked = (userId, blockedId, message) => {
    if (io) {
        io.emit('blocked-you-user', { userId, blockedId, message });
    }
    else {
        console.error('Socket.IO not initialized');
    }
};
exports.notifyAsBlocked = notifyAsBlocked;
// Emit a message to a specific room (for individual users or conversations)
const notifyRoom = (roomId, message) => {
    if (io) {
        io.to(roomId).emit('room-message', message);
    }
    else {
        console.error('Socket.IO not initialized');
    }
};
exports.notifyRoom = notifyRoom;
