import {Server} from 'socket.io';
import onConnect from './events/onConnect.js';
import onMessage from './events/onMessage.js';

export const initializeServer = function(server) {
    const io = new Server(server, { 
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        onConnect(socket);

        socket.on('message', (data) => {
            onMessage(socket, data);
            io.emit('message', data);
        });

        socket.on('disconnect', (reason) => {
            console.log(`client ${socket.id} has disconnected. Reason: ${reason}`);
        });
    });
}