import { useState } from "react";
import { useAuth } from "../context/AuthContext/AuthContext";
import useWebSocket from "./useWebSocket";

export default function useFetchProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {token, isAuthenticated} = useAuth();
    const { socket, sendMessage } = useWebSocket('http://localhost:8000');

    const fetchProjects = async() => {
        
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/projects`, {
                headers: {'Content-Type': 'application/json', authorization: `Bearer ${token}`}
            });
            const result = await response.json();
            setProjects(result);
            return result;
        } catch (error) {
            setError(error.message);
            console.error('there was an error fetching tasks', error.message);
        } finally {
            setLoading(false);
        }
    }

    const addProject = async(project, originSocketId, sendWS = true) => {
        try {
            const response = await fetch('http://localhost:3000/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(project)
            });
            if(sendWS)
                sendMessage('message', { message: {sender: originSocketId, type: 'project:add', payload: project}});
            
            const result = await response.json();
            setProjects(prevProjects => 
                [...prevProjects, result]
            );
            return result;
        } catch (error) {
            setError(error.message);
            console.error('there was an error adding project', error.message);
        }
    }

    const updateProject = async(projectId, updatedProject) => {
        try {
            const response = await fetch(`http://localhost:3000/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedProject)
            });

            const result = await response.json();
            sendMessage('message', { message:{ sender: socket.current.id, type: 'project:update', objectId: projectId, payload: result }});
            setProjects(prev =>
                prev.map(project => (project._id === projectId ? result : project))
            );
        } catch (error) {
            setError(error.message);
            console.error('there was an error updating project', error.message);
        }
    }

    const updateProjectStage = async (projectId, updatedStage, action) => {
        try {
            const response = await fetch(`http://localhost:3000/projects/stage/${projectId}`, {
                method: action === 'update' ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedStage)
            });

            const result = await response.json();
            sendMessage('message', { message: { sender: socket.current.id, type: 'project:update', objectId: projectId, payload: result }});
            setProjects(prev =>
                prev.map(project => (project._id === projectId ? result : project))
            );
        } catch (error) {
            setError(error.message);
            console.error('there was an error updating project', error.message);
        }
    }

    const deleteProject = async(projectId) => {
        try {
            const response = await fetch(`http://localhost:3000/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            sendMessage('message', { message: { sender: socket.current.id, type: 'project:delete', objectId: projectId }});
            setProjects(prev => 
                prev.filter(project => project._id !== projectId)
            );
        } catch (error) {
            setError(error.message);
            console.error('there was an error deleteing project', error.message);
        }
    }

    return { projects, setProjects, loading, error, fetchProjects, addProject, updateProject, updateProjectStage, deleteProject };
}