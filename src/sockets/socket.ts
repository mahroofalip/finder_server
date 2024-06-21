// Socket.ts

import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

interface JoinRoomData {
    room_id: string;
}

interface MessageData {
    sender_id :any;
    receiver_id:any
    room_id: string;
    message_content: string;
    timestamp: any,
    status: 'unread'

}

interface RoomNameData {
    room_id: string;
    roomName: string;
}

let io: SocketIOServer;

export const initSocket = (server: HttpServer) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: '*', // your frontend URL http://localhost:3000
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on('join-room', (data: JoinRoomData) => {
            console.log(data,"join-room");
            
            socket.join(data.room_id);
        });

        socket.on('send-message', (data: MessageData) => {
            socket.to(data.room_id).emit('receive-message', data);
        });

        socket.on('send-roomname', (data: RoomNameData) => {
            socket.to(data.room_id).emit('receive-roomname', data);
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};

export const notifyUser = (room: string, message: string) => {
    if (io) {
        io.to(room).emit('receive-message', { room, message });
        console.log(`Notification sent to room ${room}: ${message}`);
    } else {
        console.error('Socket.IO not initialized.');
    }
};
