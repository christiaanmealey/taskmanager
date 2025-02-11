import { parentPort } from 'worker_threads';
import { createServer } from 'http';
import { initializeServer } from '../sockets/index.js';

const server = createServer();

server.listen(8000, () => console.log('socket server listening'));
const io = initializeServer(server);

parentPort.on('message', (message) => {
    io.emit('broadcast', message);
});