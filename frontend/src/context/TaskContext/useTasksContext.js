import { useContext } from "react";
import { TaskContext } from "./TaskContextProvider";

export default function useTasksContext() {
    const context = useContext(TaskContext);
    if(!context) {
        throw new Error('useTasks must be used within a TasksContextProvider');
    }

    return context;
};