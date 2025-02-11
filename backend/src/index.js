import express from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { Worker } from 'worker_threads';
import connectDB from '../config/db.js';

import taskRoutes from './routes/tasks.js';
import projectRoutes from './routes/projects.js';
import userRoutes from './routes/users.js';
import settingRoutes from './routes/settings.js';
import socketRoutes from './routes/socketRoutes.js';
import uploadRoutes from './routes/uploads.js';
import { rateLimit } from './middleware/limiter.js';

await connectDB();

dotenv.config();
const app = express();
const server = createServer(app);

app.use(bodyParser.json());
app.use(cors());

app.use('/tasks', rateLimit({windowMs: 60 * 1000, maxRequests: 100}), taskRoutes);
app.use('/projects', rateLimit({windowMs: 60 * 1000, maxRequests: 100}), projectRoutes);
app.use('/users', rateLimit({windowMs: 60 * 1000, maxRequests: 100}), userRoutes);
app.use('/settings', rateLimit({windowMs: 60 * 1000, maxRequests: 100}), settingRoutes);
app.use('/uploads', rateLimit({windowMs: 60 * 1000, maxRequests: 100}), uploadRoutes);
app.use('/ws', socketRoutes);

const socketWorker = new Worker('./src/workers/socketWorker.js');

// function solve(b1, b2) {
//     const num1 = parseInt(b1, 2);
//     const num2 = parseInt(b2, 2);
    
//     const binaryResult = (num1 + num2).toString(2);
//     console.log(binaryResult.padStart(32, '0'));
// }

// const wfile = fs.promises.writeFile('./src/test.txt', 'hello world');
// wfile.then(() => {
//     console.log('file created');
// })
// solve("00000000000000000000000000000111", "00000000000000000000000000001000");

server.listen(3000, () => {
    console.log('server listening');
});