import express from 'express';
import {
    createTask, 
    updateTask, 
    deleteTask, 
    fetchTasks, 
    fetchTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, fetchTasks);
router.get('/:id', protect, fetchTask);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;