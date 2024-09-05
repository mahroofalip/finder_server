import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
let io: SocketIOServer;

export const initSocket = (server: HttpServer) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: "http://localhost:3000", // Adjust as needed for security
            credentials: true,
        },
    });

    io.on('connection', (socket) => {

        socket.on('disconnect', () => {
        });
    });
};
export const notifyUser = (message: any,sender_Id: any) => {
    if (io) {
        io.emit('receive-message', {...message,sender_Id});
    } 
};

export const notifyAsBlocked = (blcokedId: number, message: string) => {
    if (io) {
        io.emit('blocked-you-user', { blcokedId, message });
    }
};

