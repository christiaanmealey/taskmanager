import { ObjectId } from "mongodb";
import { 
    findAllTasks, 
    findTaskById, 
    deleteTask as modelDeleteTask,
    createTask as modelCreateTask,
    updateTask as modelUpdateTask 
} from "../models/taskModel.js";

/**
 * Calls taskModel to fetch all tasks from the database
 * @returns {Promise<Array>} - A list of all tasks
 */
export async function getTasks(query) {
    let id;
    if(Object.hasOwn(query, 'projectId')) {
        id = query['projectId'];
        const oid = new ObjectId(id);
        query['projectId'] = oid;
    }
    try {
        const tasks = await findAllTasks(query);
        return tasks;   
    } catch (error) {
        throw error;
    }
}

/**
 * Calls taskModel to fetch a task by ID
 * @param {string} id - The ID of the task to fetch 
 * @returns {Promise<Array>} - The task object from taskModel or null if not found
 */
export async function getTask(id) {
    try {
        const task = await findTaskById(new ObjectId(id));
        return task;    
    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param {object} task - The task to insert 
 */
export async function createTask(task) {
    try {
        const result = await modelCreateTask(task);
        const taskId = result._id;
        const newTask = await findTaskById(taskId);
        return newTask;
    } catch (error) {
        throw error;
    }
}

export async function updateTask(id, task) {
    const oid = new ObjectId(id);
    const query = {_id: oid};
    const projectId = new ObjectId(task.projectId);
    task.projectId = projectId;
    const update = {$set: task};

    try {
        const result = await modelUpdateTask(query, update);
        const updatedTask = await findTaskById(id);
        return updatedTask  ;
    } catch (error) {
        throw error;
    }
}

export async function deleteTask(id) {
    const oid = new ObjectId(id);
    const query = {_id: oid};
    try {
        const result = await modelDeleteTask(query);
        return result;
    } catch (error) {
        throw error;    
    }
}