import * as taskService from './taskService.js';

export async function getAllTasks() {
    try {
        const tasks = await taskService.getTasks();
        return tasks;
    } catch (error) {
        console.error('error in ws service fetching tasks');
    }
}