import Task from "../schemas/taskSchema.js";
import { ObjectId } from "mongodb";
/**
 * Fetches all tasks from the database
 * @returns {Promise<Array>} - List of all tasks
 */
export async function findAllTasks(query) {
    try {
        const result = await Task.find(query);
        return result;
    } catch (error) {
        console.error('there was an error fetching tasks for the database', error);
        throw error;
    }
}

/**
 * Fetches a task by ID from the database
 * @param {string} id - The ID of the task to fetch
 * @returns {Promise<Array>} - The task object or null if not found;
 */
export async function findTaskById(id) {
    try {
        const result = await Task.findById(id);
        return result;
    } catch (error) {
        console.log(`there was an error fetching task ${id} from database`, error);
        throw error;
    }
}

/**
 * Updates a task in the database
 * @param {string} id - The ID of the task to update 
 * @param {object} task - The task object containing the task fields to update
 * @returns {Promise<Object>} - The result of the update operation
 */
export async function updateTask(query, update) {
    try {
        const result = await Task.updateOne(query, update);
        
        // if(result.matchedCount === 0) {
        //     console.warn(`No task found with query:`, JSON.stringify(query));
        // } else if(result.modifiedCount === 0) {
        //     console.warn(`Task found but no changes were made for query:`, JSON.stringify(query), JSON.stringify(update));
        // }
        
        return result;
    } catch (error) {
        console.error(`there was an error updating task: ${query}`, error);
        throw error;
    }
}

/**
 * Creates a new Task in the database
 * @param {object} task - An object containing the properties for the new Task 
 * @returns {Promise<Object>} - The result of the insert operation
 */
export async function createTask(task) {
    try {
        //const projectId = new ObjectId(task.projectId);
        //task.projectId = projectId;
        const result = await Task.create(task);
        return result;
    } catch (error) {
        console.error('there was an error creating task', error);
        throw error;
    }
}

/**
 * Deletes a task in the database
 * @param {string} id - The ID of the task to be deleted
 * @returns {Promise<Object>} - The result of the delete operation
 */
export async function deleteTask(query) {
    try {
        const result = await Task.deleteOne(query);
        return result;
    } catch (error) {
        console.error(`There was an error deleting task with query: ${query}`, error);
        throw error;
    }
}