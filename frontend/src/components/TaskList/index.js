import { useState, useRef, useCallback, useEffect } from "react";
import useTasksContext from "../../context/TaskContext/useTasksContext";
import { PlusIcon } from "@heroicons/react/24/solid";
import Modal from "../../components/Modal";
import EditTask from "../../components/EditTask";
import TaskCard from "../TaskCard";
import useWebSocketContext from "../../context/WebSocketContext/useWebSocketContext";

function TaskList({stageIndex, stageName, projectId, onDrop}) {
    const { tasks, addTask, updateTask } = useTasksContext();
    const [addTaskView, setAddTaskView] = useState(false);
    const [hoverState, setHoverState] = useState(false);
    const taskNameRef = useRef('');
    const [editTaskModal, setEditTaskModal] = useState(false);
    const [currentTask, setCurrentTask] = useState();
    const [filteredTasks, setFilteredTasks] = useState(null);
    const { socket } = useWebSocketContext();

    const handleClose = useCallback(() => 
        setEditTaskModal(false), 
    []);

    useEffect(() => {
        if(socket.current) {
            socket.current.on('message', (event) => {
                if(event.message.type === 'task:update') {
                    /* refiltering by stage based on ws update
                        NOTE: this is more complex than i originally thought.
                        if a user visits another project, the tasks state is replaced 
                        with tasks from the other project, causing the filter method to 
                        filter tasks from the other project.
                        
                        probably will have to set tasks state by project id eg. tasks[projectId] = []
                    */
                    filterTasks(event.message.objectId, event.message.payload);   
                }
                if(event.message.type === 'task:add') {
                    const newTask = event.message.payload;
                    if(newTask.stage === stageName) {
                        setFilteredTasks(prev => [...prev, event.message.payload]);
                    }
                }
                if(event.message.type === 'task:delete') {
                    setFilteredTasks(prev => prev.filter(task => task._id !== event.message.objectId));
                }
            });

            return () => {
                socket.current.off('message');
            }
        }
    }, []);

    const filterTasks = (taskId, _task) => {
        const filtered = tasks.map(task => task._id === taskId ? _task : task)
        .filter(task => task.stage === stageName)
        .map(task => ({
            ...task,
            checklistTotals: getListItemsTotals(task),
            pastDue: isPastDue(task.dueDate),
            cardDate: formatDate(task.dueDate)
        }));
        setFilteredTasks(filtered);
        setTimeout(() => {

        }, 100)
    }

    const handleAddTask = (e) => {
        if(e.key === "Enter") {
            const newTask = {
                taskName: taskNameRef.current.value,
                stage: stageName,
                projectId
            };
            addTask(newTask);
            setAddTaskView(false);
        }
    };

    const handleOnTaskClick = (taskId) => {
        setCurrentTask(filteredTasks.filter(_task => _task._id === taskId).at(0));
        setEditTaskModal(true);
    };

    /* drag/drop handlers */

    const dropTask = (event, stage) => {
        event.preventDefault();
        setHoverState(false);
        const taskId = event.dataTransfer.getData('taskId');
        onDrop(event, taskId, stage);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    }

    const handleDragEnter = () => {
        setHoverState(true);
    }

    const handleDragLeave = (event) => {
        if(!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
            setHoverState(false);
        }
    }
    /* drag/drop handlers */

    /* task card meta display methods (past due flag, 0/4 items complete) */
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const monthName = date.toLocaleString('en-US', {month: 'short'});
        const day = date.getDate().toString().padStart(2, '0');
        const formattedDate = `${monthName} ${day}`;
        return formattedDate;
    };
    const getListItemsTotals = (task) => {
        if(!task || !task.checklist || task.checklist.length === 0) return;
        let totalItems = 0;
        let totalCompleted = 0;
        task.checklist.map(cl => {
            totalItems += cl.items.length;
            totalCompleted = cl.items.filter((item) => item.completed).length;
        });
        return {totalItems, totalCompleted};   
    }

    const isPastDue = (dueDate) => {
        const now = Date.now();
        const due = new Date(dueDate).getTime();
        return now > due;
    }
    /* task card meta display methods */

    /* filter tasks by stage name and add task card meta */
    useEffect(() => {
        setFilteredTasks(tasks
            .filter(task => task.stage === stageName)
            .map(task => ({
                ...task,
                checklistTotals: getListItemsTotals(task),
                pastDue: isPastDue(task.dueDate),
                cardDate: formatDate(task.dueDate)
            })));
    }, [tasks])

    return (
        <div 
            className={`task-list mt-2 w-100 max-h-screen overflow-auto no-scrollbar relative`}
            onDrop={(event) => dropTask(event, stageName)}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            >
            <div className={`dragover-column-blur ${hoverState ? 'block h-full absolute z-10 top-0 left-0 backdrop-blur-sm w-full bg-white rounded-lg bg-opacity-20 border border-gray-200': 'hidden'}`}></div>
            {filteredTasks?.length === 0 ? (
                <h3 className="no-tasks bold-orange-txt">No current tasks for this project</h3>
            ) : (
                filteredTasks?.map((task) => (
                    <TaskCard key={task?._id} task={task} onTaskClick={handleOnTaskClick} />
                ))
            )}
                { editTaskModal && currentTask &&
                    (
                    <Modal key={currentTask._id} openModal={editTaskModal} closeModal={handleClose}>
                        <EditTask key={currentTask._id} closeModal={handleClose} task={currentTask} />
                    </Modal>
                    )
                }
                
                {addTaskView &&
                    <div className="add-task group shadow-md w-100 bg-white rounded-xl p-4 mb-2 cursor-pointer border border-gray-300 border-opacity-50 hover:border-primary-600">
                        <input className="outline-none" onKeyDown={(e) => handleAddTask(e)} placeholder="Enter a title" ref={taskNameRef} autoFocus />
                    </div>
                }
                <div className="flex justify-end items-center">
                    <button 
                        id={projectId} 
                        onClick={() => setAddTaskView(true)} 
                        className="flex justify-end px-2"
                    >
                        <PlusIcon className="size-6 text-gray-700" />
                    </button>
                </div>
        </div>
    )
}

export default TaskList;