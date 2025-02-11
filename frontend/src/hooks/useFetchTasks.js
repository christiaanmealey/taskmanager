import { useState } from "react";
import { useAuth } from "../context/AuthContext/AuthContext";
import useWebsocket from "./useWebSocket";

export default function useFetchTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { token, isAuthenticated} = useAuth();
    const { messages, sendMessage, socketRef } = useWebsocket('http://localhost:8000');

    const fetchProjectTasks = async(selectedProject) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/tasks?projectId=${selectedProject._id}`, {
                headers: {'Content-Type': 'application/json', authorization: `Bearer ${token}`}
            });

            const result = await response.json();
            setTasks(result);
        } catch (error) {
            setError(error.message);
            console.error('there was an error fetching tasks', error.message);
        } finally {
            setLoading(false);
        }
    }

    const addTask = async(newTask) => {
        try {
            const response = await fetch(`http://localhost:3000/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newTask)
            });

            const result = await response.json();
            sendMessage('message', {message: {type: 'task:add', objectId: result._id, payload: result}});
            setTasks(prev =>
                [...prev, result]
            );
        } catch (error) {
            setError(error.message);
            console.error('there was an error adding task', error.message);
        }
    }

    const updateTask = async(taskId, updatedTask) => {
        try {
            const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedTask)
            });
    
            const result = await response.json();
            sendMessage('message', {message: {type: 'task:update', objectId: taskId, payload: result}});
            setTasks(prev => 
                prev.map(task => (task._id === taskId ? result : task))
            );
        } catch (error) {
            setError(error.message);
            console.error('there was an error updating task', error.message);
        }
    }

    const deleteTask = async(taskId) => {
        try {
            const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            sendMessage('message', {message: {type: 'task:delete', objectId: taskId}});

            setTasks(prev => 
                prev.filter(task => task._id !== taskId)
            );
        } catch (error) {
            setError(error.message);
            console.error('there was an error deleting task', error.message);
        }
    }

    return { tasks, setTasks, loading, error, fetchProjectTasks, addTask, updateTask, deleteTask };
}