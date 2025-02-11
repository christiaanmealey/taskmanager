import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext/AuthContext";
import useClickOutside from "../../hooks/useClickOutside";
import useWebSocketContext from "../../context/WebSocketContext/useWebSocketContext.js";
import useTasksContext from "../../context/TaskContext/useTasksContext";
import ReactQuill from 'react-quill';
import { 
    CheckIcon, 
    ComputerDesktopIcon,
    XMarkIcon,
    ChevronDownIcon,
    Bars3BottomLeftIcon,
    ClockIcon,
    UserGroupIcon,
    ArrowPathIcon,
    MinusCircleIcon
} from "@heroicons/react/24/solid";
import { 
    UserPlusIcon, 
    UsersIcon,
    ListBulletIcon,
    ArchiveBoxIcon
} from "@heroicons/react/20/solid";

import Flyout from "../Flyout";
import TaskMembers from "../TaskMembers";
import TaskDates from "../TaskDates/index.js";
import MoveTask from "../MoveTask/index.js";

import 'react-quill/dist/quill.snow.css';
import './EditTask.css';

function EditTask({closeModal, task, triggerOnEditTask, triggerOnDeleteTask}) {
    const taskNameRef = useRef('');
    const descriptionRef = useRef('');
    const taskStatusRef = useRef('');
    const flyoutRef = useRef(null);
    const checklistItemRef = useRef('');
    const checklistTitleRef = useRef('');
    
    const [activeFlyout, setActiveFlyout] = useState('');
    const [checklists, setChecklists] = useState([]);
    const [showAddChecklist, setShowAddChecklist] = useState(false);
    const [showEditDescription, setShowEditDescription] = useState(false);
    const [currentChecklist, setCurrentChecklist] = useState([]);
    const [checklistItems, setChecklistItems] = useState([]);
    const [currentChecklistTitle, setCurrentChecklistTitle] = useState(null);
    const [taskData, setTaskData] = useState(task);
    const [taskDescription, setTaskDescription] = useState(task.description);
    
    const {isAuthenticated, token, user} = useAuth();
    const { tasks, setTasks, updateTask, deleteTask } = useTasksContext();
    const { socket, sendMessage } = useWebSocketContext();
    
    // const handleClickOutside = useCallback(() => {
    //     setActiveFlyout('');
    // }, []);
    //useClickOutside(flyoutRef, handleClickOutside);



    if(setActiveFlyout === '') {
        flyoutRef.current = null;
    }

    /* websoket messages */
    useEffect(() => {
        socket.current.on('message', (event) => {
            if(event.message.type === 'task:update') {
                const updatedTask = event.message.payload;

                //figure out a way to only update new items
                taskNameRef.current.value = updatedTask.taskName;
                if(taskStatusRef.current) taskStatusRef.current.checked = updatedTask.status === 'complete';
                setTaskDescription(updatedTask.description);
                setChecklists(updatedTask.checklist);
                
                setTasks(prevTasks =>
                    prevTasks.map((task) => {
                        if(task._id === event.message.objectId) {
                            const updated = {...task, updateTask}; 
                            return updated;
                        } else {
                            return task;
                        }
                    })
                );
                setTimeout(() => {setTaskData(taskData);},0);
                
            }
        });

        return () => {
            socket.current.off('message');
        }
    }, []);

    useEffect(() => {
        const updatedTask = tasks.find((_task) => _task._id === task._id);
        if(updatedTask) {
            setTaskData(updatedTask);
        }
    }, [tasks, task])

    useEffect(() => {
        const {['_id']: _, ...taskModel} = taskData;
        setChecklists(taskModel.checklist);
        setTaskData(taskModel);
        return () => {
            console.log('unmounted');
        }
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const monthName = date.toLocaleString('en-US', {month: 'short'});
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const formattedDate = `${monthName.toUpperCase()} ${day}, ${year}, ${hours}:${minutes} AM`;
        return formattedDate;
    }

    const handleCBChange = (listIndex, itemIndex) => {
        setChecklists((prevChecklists) => {
            const updatedChecklists = [...prevChecklists];
            const item = updatedChecklists[listIndex].items[itemIndex];
            item.completed = !item.completed;
            handleChange('checklist', updatedChecklists);
            return updatedChecklists;
        });
    };

    const handleAddChecklist = () => {
        const checklistTitle = checklistTitleRef.current.value;
        const newChecklist = {name: checklistTitle, items:[]};

        setActiveFlyout('');
        setCurrentChecklist(checklistTitle);
        setChecklists((prevLists) => {
            const update = [...prevLists, newChecklist];
            updateTask(task._id, {...taskData, checklist: update});
            return update;
        });
        setChecklistItems([]);
        setCurrentChecklistTitle(checklistTitle);
        setShowAddChecklist(true);
    }
    
    const handleAddChecklistItem = (event, _checklist) => {
        event.preventDefault();
        const checklistItem = checklistItemRef.current.value;
        const newItem = {name: checklistItem, completed:false};
        if(!checklistItems.length) {
            setChecklistItems(_checklist.items);
        }
        setChecklistItems((prevItem) => {
            const items = [...prevItem, newItem];
            setChecklists(prevLists => {
                const newList = prevLists.map((item, index) => {
                    if(index === prevLists.length-1) {
                        item.items = items;
                    }
                    return item;
                });
                updateTask(task._id, {...taskData, checklist: newList});
                return newList;
            })
            return items;
        });

        checklistItemRef.current.value = "";
        checklistItemRef.current.focus();
    }

    const amountComplete = (_checklist) => {
        if(!_checklist.items) return 100;
        const totalItems = _checklist.items.length;
        const itemsComplete = _checklist.items.filter(item => item.completed).length;
        return itemsComplete/totalItems*100 || 0;
    }

    const handleDeleteList = (event, _checklist) => {
        event.cancelBubble = true;
        setChecklists(prevChecklists => {
            const cl = prevChecklists.filter(item => item.name !== _checklist.name);
            return cl;
        });
        
        const updatedChecklists = task.checklist.filter((item) => item.name !== _checklist.name);
        const {['_id']: _, ...updatedTask} = task;
        updatedTask.checklist = updatedChecklists;
        updateTask(task._id, updatedTask);
        setTaskData((prevTask) => ({
            ...prevTask,
            checklist: prevTask.checklist.filter((item) => item.name !== _checklist.name)
        }));
    }

    const handleChange = (field, value) => {
        if(taskData[field] === value) return;
        setTaskData((prevTask) => ({
            ...prevTask, [field]: value
        }));
        updateTask(task._id, {...taskData, [field]: value});
    }

    const handleOpenFlyout = (flyout) => {
        setActiveFlyout(flyout);
    }

    /*Sidebar*/

    const showMembers = (event) => {
        console.log(event);
    }

    const handleUnassignUser = (_user) => {
        console.log(_user);
    }

    const handleJoinTask = () => {
        console.log(user);
    }

    const handleChangeStage = (event, newStage) => {
        event.preventDefault();
        const oldStage = taskData.stage;
        const {['_id']: _, ...updatedTask} = taskData;
        updatedTask.prevStage = oldStage;
        updatedTask.stage = newStage;
        setTaskData(prevTask => {
            if(newStage !== prevTask.stage) {
                const update = {...prevTask, stage: newStage, prevStage: oldStage};
                updateTask(task._id, update);
                return update;
            }
            return prevTask;
        });
    }

    const handleDeleteTask = (taskId) => {
        deleteTask(taskId);
        setTasks(prev => prev.filter(task => task._id !== taskId));
        closeModal();
    }

    const handleCloseFlyout = () => {
        setTimeout(() => {
            setActiveFlyout('');
        }, 0);
    }

    const handleDescriptionChange = (value) => {
        setTaskDescription(value);
        setTaskData(prevTaskData => (
            {...prevTaskData, description: value}
        ));
    }

    const handleSaveDescription = (e) => {
        e.preventDefault(); 
        updateTask(task._id, {...taskData, description: taskDescription});
        setShowEditDescription(false);
        setTaskData(prevTaskData => (
            {...prevTaskData, description: taskDescription}
        ));
    }

    /*Sidebar*/

    return (
        <div className="w-full flex flex-col min-h-[500px] items-start">
            <div className="task-header w-full flex justify-between items-start mb-8">
                <div className="text-gray-600">
                    <ComputerDesktopIcon className="size-6" />
                </div>
                <div className="flex-grow -mt-1">
                    <div>
                        <input
                            onBlur={() => handleChange('taskName', taskNameRef.current.value)} 
                            contentEditable="true" 
                            ref={taskNameRef}
                            onKeyDown={(event) => {if(event.key === 'Enter') { handleChange('taskName', taskNameRef.current.value); taskNameRef.current.blur()}}}
                            defaultValue={taskData.taskName}
                            className="w-full outline-blue-500 flex-1 mr-2 pl-2 text-xl text-gray-800 focus:bg-white focus:border-blue-500"
                        />

                    </div>
                    <div className="text-xs pl-2 flex justify-start items-center">
                        <p>in list:</p>
                        <button 
                            className="ml-2 flex bg-gray-100 p-1 text-gray-700 uppercase"
                            onClick={() => setActiveFlyout("moveTask")}
                        >
                            {taskData.stage}
                            <ChevronDownIcon className="mr-2 size-4" />
                        </button>
                        <Flyout title="Move Task" className="mt-5" openFlyout={activeFlyout === "moveTask"} closeFlyout={handleCloseFlyout} inModal={true}>
                            <MoveTask taskId={task._id} stageName={taskData.stage} onCloseFlyout={handleCloseFlyout} />
                        </Flyout>
                    </div>

                </div>
                <button onClick={() => closeModal()}>
                    <XMarkIcon className="size-6" />
                </button>
            </div>

            {taskData.dueDate && 
                <div className="text-sm pl-2 ml-5 mb-5">
                    <p>Due Date:</p>
                    <div className="flex items-center justify-start font-medium">
                        <div className="mr-2">
                            <input ref={taskStatusRef} checked={taskData.status === 'complete'} onChange={() => handleChange('status', taskData.status === 'complete' ? '' : 'complete')} className="size-4 flex-grow-0 flex-shrink-0" type="checkbox" /> 
                        </div>
                        <div>
                            <button onClick={() => setActiveFlyout("datesHeader")} className="flex bg-gray-100 p-1 text-gray-700 uppercase items-center">
                                {formatDate(taskData.dueDate)}
                                {taskData.status === "complete" &&
                                    <span className="bg-green-500 text-xs text-white mx-2 px-0.5">complete</span> 
                                }
                                <ChevronDownIcon className="space-x-1 size-4" />
                            </button>
                            <Flyout openFlyout={activeFlyout === "datesHeader"} closeFlyout={() => setActiveFlyout('')} title="Dates" inModal={true}>
                                <TaskDates taskId={task._id} task={taskData} setTask={setTaskData} dueDate={taskData.dueDate || new Date()} onCloseFlyout={handleCloseFlyout} />
                            </Flyout>
                        </div>
                    </div>
                </div>
            }

            <div className="flex w-full content-container gap-5">
                <div className="flex-grow items-start">
                    <form className="space-y-4 md:space-y-4 h-full w-full">
                        <div className="description mb-8">
                            <div className="mb-2 flex items-start text-sm font-medium text-gray-900 dark:text-white">
                                <div>
                                    <Bars3BottomLeftIcon className="mt-0.5 mr-2 size-6" />
                                </div>
                                <div className="flex-grow items-start">
                                    <div className="text-lg">
                                        Description
                                    </div>
                                </div>
                                <div className="text-md">
                                    <button onClick={(e) => {e.preventDefault(); setShowEditDescription(true)}} className="bg-gray-100 rounded-sm hover:brightness-90 px-3 py-1.5">Edit</button>
                                </div>
                            </div>
                            <div className="w-[94%] ml-[6%]">
                                <div className="mt-4 w-full">
                                    {showEditDescription &&
                                        <div class="editor bg-g flex-grow w-full"> 
                                            <ReactQuill className="mb-4" theme="snow" value={taskDescription} onChange={handleDescriptionChange} />
                                            <button 
                                                onClick={(e) => handleSaveDescription(e)}
                                                className="py-1 px-2 bg-primary-500 text-white rounded-sm mr-2 hover:brightness-90"
                                            >
                                                Save
                                            </button>
                                            <button className="py-1 px-2 rounded-md bg-white hover:brightness-90" onClick={() => setShowEditDescription(false)}>Cancel</button>
                                        </div>
                                    }
                                    {taskData.description && !showEditDescription &&
                                        <div 
                                            onClick={() => setShowEditDescription(true)} 
                                            className="cursor-pointer list-disc" 
                                            dangerouslySetInnerHTML={{__html: taskDescription}}></div>
                                    }

                                    {!taskData.description && !showEditDescription &&
                                        <div onClick={() => setShowEditDescription(true)} className="bg-gray-200 cursor-pointer pb-7 pt-2 px-2 text-gray-800  hover:brightness-90">
                                            Add a detailed description...
                                        </div> 
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="checklists mb-8">
                            {checklists &&
                                checklists.map((_checklist, checklistIndex) => (
                                    <div className="py-2 my-2" key={checklistIndex}>
                                        <div className="flex justify-between">
                                            <p className="font-semibold text-lg flex justify-start">
                                                <span className="icon mr-2 text-gray-600 opacity-80">
                                                    <CheckIcon className="size-6" /> 
                                                </span>
                                                {_checklist.name}
                                            </p>
                                            <button className="text-sm pt-2 text-gray-600" onClick={(event) => handleDeleteList(event, _checklist)}>Delete</button>
                                        </div>
                                        <div className="progress-container mb-2">
                                            <p className="text-xs">{amountComplete(_checklist)}%</p>
                                            <div className="progress-bar h-1 relative bg-gray-200">
                                                <div className={`h-1 bg-gray-500 mb-2 w-[calc(${amountComplete(_checklist)}%)] flex`}></div>
                                            </div>
                                        </div>
                                        {_checklist.items &&
                                            <div>
                                                <ul className="list-none mt-4">
                                                    {_checklist.items.map((item, index) => (        
                                                        <li className={item.completed ? "flex items-center space-x-2 line-through my-1" : 'my-1 flex items-center space-x-2'} key={index}>
                                                            <input id={`item-${index}`} className="h-5 w-5" type="checkbox" name="checklists" onChange={() => handleCBChange(checklistIndex, index)} defaultValue={item.name} checked={item.completed || false} />
                                                            <label htmlFor={`item-${index}`} className="">{item.name}</label>
                                                        </li>
                                                    ))}
                                                </ul>
                                                {showAddChecklist && _checklist.name === currentChecklist &&
                                                    <div className="mt-4 w-[96%] ml-[4%]">
                                                        <input 
                                                            type="text" 
                                                            ref={checklistItemRef} 
                                                            className="bg-gray-50 outline-none border border-gray-600 text-gray-900 rounded-md mb-1 px-1 py-1.5"
                                                            placeholder="list item"
                                                            autoFocus
                                                        />
                                                        <button className="bg-green-700 text-white px-2 py-0.5 rounded-sm mt-1" onClick={(event) => {handleAddChecklistItem(event, _checklist)}}>Add</button>
                                                        <button className="ml-2 text-gray-800" onClick={() => {setCurrentChecklist(''); setShowAddChecklist(false)}}>Cancel</button>
                                                    </div>
                                                }
                                                
                                                {currentChecklist !== _checklist.name &&
                                                    <button onClick={(event) => {event.preventDefault(); setCurrentChecklist(_checklist.name); setShowAddChecklist(true)}} className="text-sm rounded-sm bg-gray-200 text-gray-600 font-medium mt-2 border px-2.5 py-1.5 ml-[5%]">
                                                        Add an item
                                                    </button>
                                                }
                                            </div>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                        
                        {/* {checklistItems && 
                            <div className="mt-0">
                                <input 
                                    type="text" 
                                    ref={checklistItemRef} 
                                    className="bg-gray-50 outline-none border border-gray-600 text-gray-900 rounded-lg mb-2 px-1 py-1.5"
                                    placeholder="list item"
                                    autoFocus
                                />
                                <span className="bg-green-700 text-white px-2 py-0.5 rounded-md mt-1" onClick={handleAddChecklistItem}>Add item</span>
                                <span className="ml-2 text-gray-800" onClick={() => setShowAddChecklist(false)}>Cancel</span>
                            </div>
                        } */}
                        <div className="activity">
                            <div className="mb-2 flex items-start text-sm font-medium text-gray-900 dark:text-white">
                                <div>
                                    <UserGroupIcon className="size-5 mt-1 mr-2" />
                                </div>
                                <div className="flex-grow items-start">
                                    <div className="text-lg">
                                        Activity
                                    </div>
                                    <ul className="mt-4">
                                        <li>User created ticket</li>
                                        <li>User moved to TO DO</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sidebar */}
                <div className="flex-auto justify-start items-start max-w-[170px]">
                    <div className="flex flex-col h-full">
                        <div className="h-full w-full m-auto flex items-start">
                            <ul className="h-auto m-0 p-0 w-full text-gray-700">
                                <li className="join relative">
                                    <button 
                                        onClick={handleJoinTask}
                                        className="rounded-sm justify-start items-center flex text-left hover:brightness-90 bg-gray-100 border w-full my-2 py-0.5">
                                        <UserPlusIcon className="size-4 mx-2" />
                                        Join
                                    </button>
                                </li>
                                <li className="members relative">
                                    <button 
                                        onClick={() => setActiveFlyout('members')}
                                        className="rounded-sm justify-start items-center flex text-left hover:brightness-90 bg-gray-100 border w-full my-2 py-0.5">
                                        <UsersIcon className="size-4 mx-2" />
                                        Members
                                    </button>
                                    <div ref={flyoutRef}>
                                        <Flyout openFlyout={activeFlyout === "members"} closeFlyout={() => setActiveFlyout('')} title="Members" inModal={true}>
                                            <TaskMembers 
                                                members={[{username: 'Christiaan'}, {username: 'Jonathan'}]} 
                                                closeFlyout={() => setActiveFlyout('')} 
                                                onRemoveMember={handleUnassignUser}
                                            />
                                        </Flyout>
                                    </div>
                                    
                                </li>
                                <li className="checklist relative">
                                    <button 
                                        onClick={() => setActiveFlyout('checklist')}
                                        className="rounded-sm justify-start items-center flex text-left hover:brightness-90 bg-gray-100 border w-full my-2 py-0.5">
                                        <ListBulletIcon className="size-4 mx-2" />
                                        Add checklist
                                    </button>

                                    <div ref={flyoutRef}>
                                        <Flyout openFlyout={activeFlyout === "checklist"} closeFlyout={() => setActiveFlyout('')} title="Add Checklist" inModal={true}>
                                            <div className="p-2">
                                                <input 
                                                    name="checklist"
                                                    className="bg-white text-gray-900 rounded-lg border focus:outline-blue-300 mb-2 border-gray-500 focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    type="text" 
                                                    ref={checklistTitleRef} 
                                                    placeholder="Checklist"
                                                    autoFocus 
                                                />
                                                <div className="flex justify-start items-end">
                                                    <button className="bg-green-700 text-white px-2 py-0.5" type="button" onClick={handleAddChecklist}>Add</button>
                                                </div>
                                            </div>
                                        </Flyout>
                                    </div>
                                </li>
                                <li className="dates">
                                    <button 
                                        onClick={() => setActiveFlyout('dates')}
                                        className="rounded-sm justify-start items-center flex text-left hover:brightness-90 bg-gray-100 border w-full my-2 py-0.5">
                                        <ClockIcon className="size-4 mx-2" />
                                        Dates
                                    </button>

                                    <div className="absolute top-0" ref={flyoutRef}>
                                        <Flyout openFlyout={activeFlyout === "dates"} closeFlyout={() => setActiveFlyout('')} title="Dates" inModal={true}>
                                            <TaskDates taskId={task._id} task={taskData} setTask={setTaskData} dueDate={taskData.dueDate || new Date()} onCloseFlyout={handleCloseFlyout} />
                                        </Flyout>
                                    </div>
                                </li>
                                <li className="section-header">Actions</li>
                                <li className="archive">
                                {taskData.stage !== 'archive' && 
                                    <button 
                                        onClick={(event) => handleChangeStage(event, 'archive')}
                                        className="rounded-sm justify-start items-center flex text-left hover:brightness-90 bg-gray-100 border w-full my-2 py-0.5">
                                        <ArchiveBoxIcon className="size-4 mx-2" />
                                        Archive
                                    </button>
                                }
                                {taskData.stage === 'archive' &&
                                    <>
                                        <button 
                                            onClick={(event) => handleChangeStage(event, taskData.prevStage)}
                                            className="rounded-sm justify-start items-center flex text-left hover:brightness-90 bg-gray-100 border w-full my-2 py-0.5">
                                            <ArrowPathIcon className="size-4 mx-2" />
                                            Move to board
                                        </button>
                                        <button 
                                            onClick={() => setActiveFlyout('deleteTask')}
                                            className={`rounded-sm justify-start items-center flex text-left hover:brightness-90 bg-red-600 text-white border border-red-950 ${activeFlyout === 'deleteTask' ? 'brightness-[20%]' : ''} w-full my-2 py-0.5`}>
                                            <MinusCircleIcon className="size-4 mx-2" />
                                            Delete
                                        </button>

                                        <div ref={flyoutRef}>
                                            <Flyout openFlyout={activeFlyout === "deleteTask"} closeFlyout={() => setActiveFlyout('')} title="Delete card?" inModal={true}>
                                                <p>All actions will be removed from the activity feed and you won’t be able to re-open the card. There is no undo.</p>
                                                <button 
                                                    onClick={() => handleDeleteTask(task._id)}
                                                    className="rounded-sm justify-start items-center flex text-left hover:brightness-90 bg-red-600 text-white border border-red-950 w-full my-2 py-0.5">
                                                    <MinusCircleIcon className="size-4 mx-2" />
                                                    Delete
                                                </button>
                                            </Flyout>
                                        </div>
                                    </>
                                }
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Sidebar */}
            </div>
        </div>
    )
}

export default EditTask;