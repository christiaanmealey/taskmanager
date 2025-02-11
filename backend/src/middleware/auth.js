import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { getUserById } from '../services/userService.js';

export const protect = asyncHandler(async(req, res, next) => {
    let token;

    if(req.headers['authorization'] && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ').at(1);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await getUserById(decoded.id);
            user.password = '***';
            req.user = user;
            next();
        } catch (error) {
            res.status(401);
            console.error(error);
            throw new Error('failed to authenticate');
        }
    }

    if(!token) {
        res.status(401);
        throw new Error('Not authorized: no token');
    }
});