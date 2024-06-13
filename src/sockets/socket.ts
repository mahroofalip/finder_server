// Socket.ts

import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

interface JoinRoomData {
    room: string;
}

interface MessageData {
    room: string;
    message: string;
}

interface RoomNameData {
    room: string;
    roomName: string;
}

export const initSocket = (server: HttpServer) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*",
        },
    });

    io.on('connection', (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on('join-room', (data: JoinRoomData) => {
            console.log(`Socket ${socket.id} joining room: ${data.room}`);
            socket.join(data.room);
        });

        socket.on('send-message', (data: MessageData) => {
            console.log(`Socket ${socket.id} sending message to room ${data.room}: ${data.message}`);
            socket.to(data.room).emit('receive-message', data);
        });

        socket.on('send-roomname', (data: RoomNameData) => {
            console.log(`Socket ${socket.id} sending room name to room ${data.room}: ${data.roomName}`);
            socket.to(data.room).emit('receive-roomname', data);
        });

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
