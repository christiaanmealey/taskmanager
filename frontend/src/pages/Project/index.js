import { useState, useEffect, useRef, useReducer } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext/AuthContext";
import useTasksContext from "../../context/TaskContext/useTasksContext";
import useProjectContext from "../../context/ProjectContext/useProjectContext";
import TaskList from "../../components/TaskList";
import Flyout from "../../components/Flyout";
import './Project.css';

import { 
    EllipsisVerticalIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusIcon,
    BugAntIcon,
    UserGroupIcon
} from "@heroicons/react/24/solid";
import useWebSocketContext from "../../context/WebSocketContext/useWebSocketContext";

function Project() {
    const { tasks, setTasks, updateTask } = useTasksContext();
    const {projects, loading, error, addProject, updateProject, updateProjectStage, deleteProject, selectedProject, selectProject} = useProjectContext();
    const {id} = useParams();
    const {token} = useAuth();
    const { socket } = useWebSocketContext();
    
    const [stages, setStages] = useState(null);
    const [showAddListForm, setShowAddListForm] = useState(false);
    const [showFlyout, setShowFlyout] = useState('');
    const [showSidebar, setShowSidebar] = useState(true);
    const [showEditListTitle, setShowEditListTitle] = useState('');

    const listTitleRef = useRef('');
    const newStageRef = useRef('');
    const projectNameRef = useRef('');

    useEffect(() => {
        if(socket.current) {
            socket.current.on('message', (event) => {
                if(event.message.type === 'task:update') {
                    //const t = tasks.find(task => task._id === event.message.objectId);
                    
                    //setTasks(prev => prev.map(task => task._id === event.message.objectId ? {...task, t} : task));
                }
            });
            return () => {
                socket.current.off('message');
            }
        }
    }, []);

    useEffect(() => {
        selectProject(id);
    }, [id]);

    useEffect(() => {
        if(selectedProject) {
            setStages(selectedProject.stages.filter(stage => !stage.isArchived));
        }
    }, [selectedProject]);

    const handleDrop = (event, taskId, newStage) => {
        const originalStage = event.dataTransfer.getData('startStage');

        updateStage(taskId, originalStage, newStage);
    }

    const handleChange = (field, value) => {
        if(selectedProject[field] === value) return;
        updateProject(selectedProject._id, {...selectedProject, [field]: value});
    }

    const updateStage = (taskId, originalStage, newStage) => {
        if(originalStage !== newStage) {
            const task = tasks.find(task => taskId === task._id);
            task.prevStage = originalStage;
            task.stage = newStage;
            const {['_id']: _, ...newTask} = task;
            updateTask(taskId, newTask);
        }
    };

    const handleAddList = () => {
        const newList = {name: listTitleRef.current.value, order: (stages?.length + 1) || 0};
        if(newList) {
            setStages(prevStages => {
                const newStages = [...prevStages, newList];
                selectedProject.stages = newStages;
                updateProjectStage(selectedProject._id, newList, 'create');
                return newStages;
            });
        }
        setShowAddListForm(false);
    }
    
    const handleUpdateListName = (listId, oldName) => {
        const newName = newStageRef.current.value;
        if(newName !== oldName) {
            setStages(prevStages => {
                const newStages = prevStages.map((stage) => {
                    if(stage._id === listId) {
                        const updatedStage = {...stage, name: newName};
                        updateProjectStage(selectedProject._id, updatedStage, 'update');
                        return updatedStage;
                    } else {
                        return stage;
                    }
                });
                selectedProject.stages = newStages;
                return newStages;
            });
        }
    }

    const handleArchiveList = (deletedList) => {
        setStages(prevStages => {
            const newStages = prevStages.filter(stage => stage._id !== deletedList._id);
            selectedProject.stages = newStages;
            deletedList.isArchived = true;
            updateProjectStage(selectedProject._id, deletedList, 'update');
            return newStages;
        });
    }
    
    return (
        <div className="grid grid-cols-10 relative">
            
            {/* Sidebar */}
            <div className={`sidebar relative drop-shadow-lg col-span-2 dark-blue-txt bg-gray-200 min-h-[calc(100vh-61px)] ${!showSidebar ? 'hidden' : ''}`}>
                <div className="relative p-2 border-b dark-blue-border">
                    Christiaan Mealey's workspace
                    <button 
                        onClick={() => setShowSidebar(!showSidebar)} 
                        className="px-1.5 font-bold dark-blue-txt right-[5px] top-[calc(50%-10px)] absolute">
                        <ChevronLeftIcon className="size-4" />
                    </button>
                </div>
                <ul className="px-4 mt-4 text-sm font-medium space-y-2">
                    <li className="flex justify-start items-center px-1">
                        <BugAntIcon className="size-4 mr-2"/> Projects
                    </li>
                    <li className="flex justify-start items-center px-1">
                        <UserGroupIcon className="size-4 mr-2" /> Members
                    </li>
                    <li className="pt-4 pb-1 font-bold flex justify-between items-center">
                        <span className="text-left">Your Projects</span><span className="text-right"><PlusIcon className="size-5" /></span>
                    </li>
                    {projects.map(project => 
                        <li key={project._id} className={`rounded-md px-1 ${project._id === selectedProject?._id ? 'bg-gray-50 py-1.5 bright-blue-txt': ''}`}>
                            <Link to={`/projects/${project._id}`}>{project.projectName}</Link>
                        </li>
                    )}
                </ul>
            </div>

            <div className={`${!showSidebar ? 'col-span-10' : 'col-span-8'}`}>
                <div id="openSidebar" className={`min-h-[calc(100vh-61px)] w-[15px] absolute bg-gray-300 ${showSidebar ? 'hidden' : ''}`}>
                    <button 
                        onClick={() => setShowSidebar(!showSidebar)} 
                        className="px-0.5 font-bold rounded-full bg-gray-300 border dark-blue-border py-0.5 left-[3px] z-10 top-[15px] absolute">
                        <ChevronRightIcon className="size-4" />
                    </button>
                </div>
                <div className="w-full bg-gray-200 pl-8">
                    <h1 className="dark-blue-txt text-2xl font-bold py-2">
                        <input
                            onBlur={() => handleChange('projectName', projectNameRef.current.value)} 
                            onKeyDown={(event) => {if(event.key === 'Enter') {projectNameRef.current.blur()}}}
                            contentEditable="true" 
                            ref={projectNameRef}
                            defaultValue={selectedProject?.projectName}
                            className="text-md bg-transparent text-gray-600 px-2 w-full inline focus:outline-blue-500 focus:bg-white focus:border-blue-500" />
                    </h1>
                </div>
                <div className="stage-list-container pt-6 pl-2 no-scrollbar flex-shrink flex flex-nowrap justify-start items-start min-h-[calc(100vh-110px)] overflow-x-auto overflow-y-hidden relative">
                    { stages?.map((stage, index) => (
                        <div key={stage._id}
                        className="mx-2 bg-gray-100 rounded-xl px-1 py-2 max-h-[calc(100vh-120px)] overflow-auto no-scrollbar min-w-[270px]">
                            <div className="flex flex-col w-full">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <input
                                            onBlur={() => handleUpdateListName(stage._id, stage.name)} 
                                            onKeyDown={(event) => {if(event.key === 'Enter') {newStageRef.current.blur()}}}
                                            contentEditable="true" 
                                            ref={newStageRef}
                                            defaultValue={stage.name}
                                            className="text-md bg-transparent text-gray-600 px-2 w-full inline focus:outline-blue-500 focus:bg-white focus:border-blue-500" />
                                    
                                    </div>
                                    <div className="">
                                        <button id={stage.name} onClick={() => setShowFlyout(stage.name)}>
                                            <EllipsisVerticalIcon className="size-6" />
                                        </button>
                                    </div>
                                    <Flyout openFlyout={showFlyout === stage.name} closeFlyout={() => setShowFlyout('')} title="List Actions" inModal={false}>
                                        <ul className="p-2">
                                            <li className="py-3">
                                                <button className="hover:brightness-75" onClick={() => handleArchiveList(stage)}>
                                                    Archive List
                                                </button>
                                            </li>
                                            <li>Copy List</li>
                                            <li>Move List</li>
                                        </ul>
                                    </Flyout>
                                </div>
                                <div>
                                {/* <TaskList stageIndex={index} stageName={stage} projectId={selectedProject._id} _tasks={tasks.filter(task => task.stage === stage)} onUpdateStage={updateStage} onDrop={handleDrop} /> */}
                                <TaskList stageIndex={index} stageName={stage.name} projectId={selectedProject?._id} onDrop={handleDrop} />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="flex mx-2 bg-gray-200 rounded-xl px-1 py-2 min-w-[270px]">
                        <div className="flex flex-col w-full">
                            <div>
                                {showAddListForm &&
                                <div className="w-full px-1">
                                    <input 
                                        className="block w-full rounded-md border-2 border-blue-400 p-1"
                                        ref={listTitleRef} 
                                        name="list-name" 
                                        type="text" 
                                        placeholder="Enter list name..."
                                        autoFocus />
                                    <button className="bg-blue-700 rounded-md px-2 font-medium py-1 mt-1 text-white text-sm" onClick={handleAddList}>Add list</button>
                                    <span
                                        onClick={() => setShowAddListForm(false)}
                                        className="text-gray-700 text-2xl font-medium px-2 cursor-pointer"
                                        > 
                                        x 
                                        </span>
                                </div>
                                }
                                {!showAddListForm &&
                                <div className="pr-5">
                                    <h1 className="text-md text-gray-600 w-full cursor-pointer px-2 inline" onClick={() => setShowAddListForm(true)}> + Add new list</h1>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Project;