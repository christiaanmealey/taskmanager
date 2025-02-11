import React, { createContext, useState, useEffect } from "react";
import useFetchTasks from "../../hooks/useFetchTasks";
import useProjectContext from "../ProjectContext/useProjectContext";

export const TaskContext = createContext();

export function TaskContextProvider({ children }) {
    const { selectedProject } = useProjectContext();
    const { tasks, setTasks, loading, error, fetchProjectTasks, addTask, updateTask, deleteTask } = useFetchTasks();

    useEffect(() => {
        if(selectedProject) {
            const data = fetchProjectTasks(selectedProject);
        }
    },[selectedProject]);

    return (
        <TaskContext.Provider value={{tasks, setTasks, loading, error, addTask, updateTask, deleteTask}}>{children}</TaskContext.Provider>
    )
}