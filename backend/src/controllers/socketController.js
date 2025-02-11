import { getAllTasks } from "../services/socketService.js";

export async function fetchTasks(socket) {
    try {
        const tasks = await getAllTasks();
        socket.emit('tasks', tasks);
    } catch (error) {
        console.error('error fecthing task ws');
    }
}