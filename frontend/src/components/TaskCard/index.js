import { useState, useRef, useCallback } from "react";

import { PencilIcon, ClockIcon, Bars4Icon, CheckIcon} from "@heroicons/react/24/solid";

function TaskCard({task, onTaskClick}) {
    
    const handleTaskClick = (task) => {
        const taskId = task._id;
        onTaskClick(taskId);
    };
    
    const pickupTask = (event, task, stage) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.dropEffect = 'move';
        event.dataTransfer.setData('taskId', task._id);
        event.dataTransfer.setData('startStage', stage);    
    };

    return (
        <div 
            draggable="true" 
            onDragStart={(event) => pickupTask(event, task, task.stage)}
            className="group w-full text-[.9rem] bg-white rounded-xl p-3 mb-2 shadow-sm cursor-pointer border border-gray-400 drop-shadow-sm border-opacity-50 hover:border-primary-600" 
            key={task._id}>
            <div className="m-0" onClick={handleTaskClick.bind(this, task)}>
                <div className="z-0 relative">
                    <div className="absolute bg-white rounded-full p-1 top-[0 right-0 hidden group-hover:block text-gray-500">
                        <PencilIcon className="size-4" />
                    </div>
                </div>
                <div className="border-b-0">{task?.taskName}</div>
                
                <div className="content-icons flex justify-start items-center">
                    {task?.dueDate && 
                    <div className="due-date-icon mr-2 mt-2 text-xs font-normal">
                        <div className={`
                            ${task?.pastDue && task.status !== 'complete' ? 'text-red-600 bg-red-100' : ''} 
                            ${task?.pastDue && task.status === 'complete' ? 'bg-green-800 text-white' : ''}
                            ${task.status === 'complete' ? 'bg-green-600 text-white' : ''}
                            rounded-sm flex items-center p-1 text-gray-500
                        `}>
                            <div className="flex items-start justify-start">
                                <ClockIcon className="size-4" />
                                <p className="ml-1">{task?.cardDate}</p>
                            </div>
                        </div>
                    </div>
                    }

                    {task?.description && 
                    <div className="description-icon  mt-2 mr-2">
                        <div className="text-gray-500">
                            <Bars4Icon className="size-4" />
                        </div>
                    </div>
                    }

                    {task?.checklist?.length > 0 &&
                    <div className="checklist-icon ml-0  mt-2 mr-2"> 
                        <div className="text-gray-500 flex items-start justify-start">
                            <CheckIcon className="size-4 mt-0.5" />
                            <span className="text-xs py-0.5 ml-0.5">{task?.checklistTotals.totalCompleted}/{task?.checklistTotals.totalItems}</span>
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default TaskCard;