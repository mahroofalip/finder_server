
import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { updateUserActivity } from "../utils/AutoInactive";
let io: SocketIOServer;


export const initSocket = (server: HttpServer) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: "*" , //process.env.CORS_FURL
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
           
        });
    });
};

export const notifyUser = (room: number, message: string) => {
    if (io) {
        io.emit('receive-message', { room, message });
    } 
};

