import express from 'express';
import { fetchTasks } from '../controllers/socketController.js';

const router = express.Router();

router.get('/tasks', (req, res) => {
    res.json({message: 'Socket task fetching initiated'});
});

export default router;