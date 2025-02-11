import asyncHandler from 'express-async-handler';
import { 
    getTasks, 
    getTask, 
    createTask as serviceCreateTask, 
    updateTask as serviceUpdateTask, 
    deleteTask as serviceDeleteTask 
} from '../services/taskService.js';
// import validators from '../validators/index.js';

export const createTask = asyncHandler(async(req, res) => {
    // const validate = validators.taskSchema;
    // const isValid = validate(req.body);

    // if(!isValid) {
    //     console.error('error validating task');
    //     return res.status(400).json({errors: validate.errors});
    // }

    try {
        const task = req.body;
        const result = await serviceCreateTask(task);
        console.log(result);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
});

export const updateTask = asyncHandler(async(req, res) => {
    // const validate = validators.taskSchema;
    // const isValid = validate(req.body);

    // if(!isValid) {
    //     console.error('error validating task');
    //     return res.status(400).json({errors: validate.errors});
    // }

    try {
        const taskId = req.params.id;
        const task = req.body;
        const result = await serviceUpdateTask(taskId, task);
        res.status(200).json(result);
    } catch (error) {
        console.error(`error updating task ${req.params.id}`, error);
        res.status(500).json({error: error.message});
    }
});

export const deleteTask = asyncHandler(async(req, res) => {
    try {
        const taskId = req.params.id;
        const result = await serviceDeleteTask(taskId);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
})

export const fetchTasks = asyncHandler(async(req, res) => {
    try {
        const query = req.query ? req.query : {};
        const tasks = await getTasks(query);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({error: 'Failed to fetch tasks'});
    }
});

export const fetchTask = asyncHandler(async(req, res) => {
    try {
        const task = await getTask(req.params.id);
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});