import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext/AuthContext";
import SideBar from "../../components/Sidebar";
import TaskList from "../../components/TaskList";
import './Tasks.css';
import AddTask from "../../components/AddTask";
import Modal from "../../components/Modal";

function Tasks() {
    const [tasks, setTasks] = useState(null);
    const [projects, setProjects] = useState(null);
    const [currentTasks, setCurrentTasks] = useState([]);
    const [projectTasks, setProjectTasks] = useState([]);
    const {token, isAuthenticated, user} = useAuth();
    const [navItems, setNavItems] = useState([]);
    const [projectTitle, setProjectTitle] = useState('');
    const [addTaskModal, setAddTaskModal] = useState(false);
    const [projectID, setProjectID] = useState(null);

    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        const storedProjects = localStorage.getItem('projects');

        const fetchTasks = async() => {
            const response = await fetch(`http://localhost:3000/tasks`, {
                headers: {'Content-Type': 'application:/json', 'Authorization': `Bearer ${token}`}
            });
            const result = await response.json();
            localStorage.setItem('tasks', JSON.stringify(result));
            setTasks(result);
        }
        const fetchProjects = async() => {
            const response = await fetch(`http://localhost:3000/projects`, {
                headers: {'Content-Type': 'application:/json', 'Authorization': `Bearer ${token}`}
            });
            const result = await response.json();
            const nav = result.reduce((acc, navItem) => {
                const found = acc.find((item) => item.projectName === navItem.projectName);
                
                if(found) {
                    
                } else {
                    acc.push({name: navItem.projectName, path: `${navItem._id}`});
                }
                return acc;
            }, []);
            localStorage.setItem('projects', JSON.stringify(result));
            setNavItems(nav);
            setProjects(result);
        }
        if(storedProjects) {
            setProjects(JSON.parse(storedProjects));
        } else {
            fetchProjects();
        }
        if(storedTasks) {
            setTasks(JSON.parse(storedTasks));
        } else {
            fetchTasks();
        }
    }, []);

    useEffect(() => {
        mergeProjectTasks();
    }, [projects]);

    const handleNav = (name, id) => {
        setCurrentTasks(filterTasksByProject(id));
        setProjectTitle(name);
    };

    const mergeProjectTasks = () => {
        if(!projects) return [];
        const _projectTasks = projects.map((project) => {
            return { projectId: project._id, projectName: project.projectName, tasks: tasks.filter(task => task.projectId === project._id)}
        });
        setProjectTasks(_projectTasks);
    }

    const filterTasksByProject = (id) => {
        const _tasks = tasks.filter((task) => {
            return task.projectId === id
        });
        return _tasks;
    }

    const handleAddTask = (e) => {
        setProjectID(e.currentTarget.id);
        setAddTaskModal(true);
    }

    const onAddTask = (task) => {
        const taskList = projectTasks.map(item => {
            
            if(item.projectId === projectID) {
                item.tasks.push(task);
            }
            return item;
        });
        setProjectTasks(taskList);
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        storedTasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }

    return (
        
        <div className="w-full overflow-x-auto">
            {/* <div className="col-span-1 m-auto h-full">
                <SideBar onChangeView={handleNav} navItems={navItems} title="Projects" />
            </div> */}
            <div className="tasks-grid flex justify-between items-start">
                {projectTasks.map((project, pIndex) =>
                    <div key={pIndex} data-projectId={project.projectId} className="task-list-containers flex flex-1 mx-2 bg-gray-200 rounded-xl px-1 py-2">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-auto justify-between">
                                <h1 className="text-md text-gray-900 px-2 inline">{project.projectName}</h1>
                                <p className="text-gray-400 text-3xl relative top-[-10px] right-[10px]">...</p>
                            </div>
                            <TaskList tasks={project.tasks} />
                            <button id={project.projectId} onClick={handleAddTask} className="py-1 text-gray-500 text-md text-left pl-2 hover:bg-gray-300 hover:rounded-xl hover:text-gray-700"><span className="text-xl">+</span> Add a task</button>
                        </div>
                        <Modal openModal={addTaskModal} closeModal={() => setAddTaskModal(false)}>
                            <AddTask triggerOnAddTask={onAddTask} closeModal={() => setAddTaskModal(false)} projectId={projectID}/>
                        </Modal>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Tasks;