import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext/AuthContext";
import TaskList from "../../components/TaskList";
import { useNavigate } from "react-router-dom";

function Home(props) {
    const {project, onAddTask} = props;
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if(!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        console.log('tasklist');
        onAddTask(true);
    }, onAddTask)
    return (
        <div>
            <TaskList project={project} onAddTask={() => onAddTask(true)}/>
        </div>
    )
}

export default Home;