import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext/AuthContext";

function AddTask({closeModal, projectId, triggerOnAddTask, stageName}) {
    const taskNameRef = useRef('');
    const descriptionRef = useRef('');
    const taskStatusRef = useRef('');
    const checklistItemRef = useRef('');
    const checklistTitleRef = useRef('');
    const [newTask, setNewTask] = useState(null);
    const {isAuthenticated, token} = useAuth();
    const [showAddChecklist, setShowAddChecklist] = useState(false);
    const [checklist, setChecklist] = useState(null);
    const [checklistItems, setChecklistItems] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setNewTask({
            'taskName': taskNameRef.current.value, 
            'description': descriptionRef.current.value, 
            'status': taskStatusRef.current.value, 
            'projectId': projectId,
            'stage': stageName,
            'priority': ''
        });
        closeModal();
    };

    useEffect(() => {
        const addTask = async() => {
            const response = await fetch('http://localhost:3000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTask)
            });

            const result = await response.json();
            triggerOnAddTask(result);
        }
        if(newTask && isAuthenticated) {   
            addTask();
        }
    }, [newTask]);

    const handleClose = (e) => {
        e.preventDefault();
        closeModal();
    }
    
    const handleAddChecklist = () => {
        const checklistTitle = checklistTitleRef.current.value;
        const newChecklist = {name: checklistTitle, items:[]};
        setChecklist(newChecklist);
        setChecklistItems([]);
        setShowAddChecklist(false);
    }
    
    const handleAddChecklistItem = () => {
        const checklistItem = checklistItemRef.current.value;
        const newItem = {name: checklistItem, completed:false};
        setChecklistItems((prevItem) => 
            [...prevItem, newItem]
        );
        console.log(checklistItems);
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 w-full">
            <h4 className="text-2xl text-gray-800">Add Task</h4>
            <div>
                <label for="taskName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                <input className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="taskName" type="text" ref={taskNameRef} />
            </div>
            <div>
                <label for="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <textarea className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="description" ref={descriptionRef}></textarea>
            </div>
            <div>
                <label for="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
                <select ref={taskStatusRef} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option name="status" value="planning">Planning</option>
                <option name="status" value="active">Active</option>
                </select>
            </div>
            <p onClick={() => setShowAddChecklist(true)}>Add checklist</p>
                {showAddChecklist && 
                    <div className="bg-gray-50 border border-gray-300 text-gray-900 p-2">
                        <label for="checklist" className="lock mb-2 text-gray-900 dark:text-white p-1 text-md">Checklist Name</label>
                        <input 
                            name="checklist"
                            className="bg-white text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            type="text" 
                            ref={checklistTitleRef} 
                            defaultValue="Checklist" 
                        />
                        <div className="flex justify-start items-end">
                            <button className="bg-green-700 text-white px-2 py-0.5" type="button" onClick={handleAddChecklist}>Add</button>
                        </div>
                    </div>

                }
                {checklistItems && 
                <div>
                    <input 
                        type="text" 
                        ref={checklistItemRef} 
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg"
                        placeholder="Item 1" 
                    />
                    <span onClick={handleAddChecklistItem}>+</span>
                    <ul>
                        {checklistItems.map((item, itemIndex) => 
                            <li>{item.name}</li>
                        )}
                    </ul>
                </div>
                }
            <div className="flex justify-end">
                <p className="mr-4 text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" onClick={handleClose}>Cancel</p>
                <button className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" type="submit">Add</button>
            </div>
        </form>
    )
}

export default AddTask;