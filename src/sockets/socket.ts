import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

let io: SocketIOServer;

// Initialize Socket.IO
export const initSocket = (server: HttpServer) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: "*", // Allow both localhost and production
            credentials: true,
    
        },
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

// Notify all connected clients
export const notifyUser = (message: any, senderId: any) => {
    if (io) {
        io.emit('receive-message', { ...message, senderId });
    } else {
        console.error('Socket.IO not initialized');
    }
};

// Notify a specific user about being blocked
export const notifyAsBlocked = (userId: number, blockedId: number, message: string) => {
    if (io) {
        io.emit('blocked-you-user', { userId, blockedId, message });
    } else {
        console.error('Socket.IO not initialized');
    }
};

// Emit a message to a specific room (for individual users or conversations)
export const notifyRoom = (roomId: string, message: any) => {
    if (io) {
        io.to(roomId).emit('room-message', message);
    } else {
        console.error('Socket.IO not initialized');
    }
};
