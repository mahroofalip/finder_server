// Socket.ts

import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import User from "../models/User";
import { updateUserActivity } from "../utils/AutoInactive";

interface MessageData {
    sender_id: any;
    receiver_id: any;
    room_id: number;
    message_content: string;
    status: 'unread';
}

interface RoomNameData {
    room_id: string;
    roomName: string;
}

let io: SocketIOServer;

const onlineUsers = new Map<number, string>(); // Map to track online users (userId -> socketId)

export const initSocket = (server: HttpServer) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: 'http://localhost:3000', // Your frontend URL
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`New connection: ${socket.id}`);

         

        // Handle user going online
        socket.on('online', async (user: { id: number }) => {
            try {
                console.log(`User ${user.id} is online`);
                updateUserActivity(user.id,true)
                // await User.update({ isOnline: true }, { where: { id: user.id } });
                // onlineUsers.set(user.id, socket.id); // Update the online users map
            } catch (error) {
                console.error('Error updating user online status:', error);
            }
        });

        // Handle user going offline
        // socket.on('offline', async (user: { id: number }) => {
        //     try {
        //         console.log(`User ${user.id} is offline`);
        //         // updateUserActivity(user.id,false)
        //         // await User.update({ isOnline: false }, { where: { id: user.id } });
        //         // onlineUsers.delete(user.id); // Remove from online users map
               
        //     } catch (error) {
        //         console.error('Error updating user offline status:', error);
        //     }
        // });

        
        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
           
        });
    });
};

export const notifyUser = (room: number, message: string) => {
    if (io) {
        io.emit('receive-message', { room, message });
        console.log(`Notification sent to room ${room}: ${message}`);
    } else {
        console.error('Socket.IO not initialized.');
    }
};

