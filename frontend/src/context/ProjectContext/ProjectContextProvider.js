import React, { createContext, useState, useEffect } from 'react';
import useFetchProjects from '../../hooks/useFetchProjects';
import { useAuth } from "../AuthContext/AuthContext";

export const ProjectContext = createContext();

export function ProjectContextProvider({ children }) {
    const { fetchProjects, projects, setProjects, loading, error, addProject, updateProject, updateProjectStage, deleteProject } = useFetchProjects();
    const { token, isAuthenticated } = useAuth();    
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        if(token && isAuthenticated) {
            fetchProjects();
        }
    }, [token, isAuthenticated]);

    const selectProject = (projectId) => {
        const project = projects.find(proj => proj._id === projectId);
        setSelectedProject(project);
    }

    return (
        <ProjectContext.Provider value={{projects, setProjects, loading, error, addProject, updateProject, updateProjectStage, deleteProject, selectedProject, selectProject}}>
            {children}
        </ProjectContext.Provider>
    );
}