"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyAsBlocked = exports.notifyUser = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "https://datingappkizzora.netlify.app", // Adjust as needed for security
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
        });
    });
};
exports.initSocket = initSocket;
const notifyUser = (message, sender_Id) => {
    if (io) {
        io.emit('receive-message', { ...message, sender_Id });
    }
};
exports.notifyUser = notifyUser;
const notifyAsBlocked = (userId, blockedId, message) => {
    if (io) {
        io.emit('blocked-you-user', { userId, blockedId, message });
    }
};
exports.notifyAsBlocked = notifyAsBlocked;
