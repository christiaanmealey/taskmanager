import { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import useTasksContext from "../../context/TaskContext/useTasksContext";
import 'react-calendar/dist/Calendar.css';

function TaskDates({taskId, task, setTask, dueDate, onCloseFlyout}) {
    const [dateValue, setDateValue] = useState(new Date(dueDate));
    const [timeValue, setTimeValue] = useState(new Date(dueDate));
    const [error, setError] = useState(null);
    const dueDateRef = useRef();
    const dueDateTimeRef = useRef();
    const { setTasks, updateTask } = useTasksContext();
    
    const handleChange = (date, event) => {
        setError(null);
        const dayName = date.toLocaleString('en-US', {weekday: 'long'});
        if(dayName === 'Saturday' || dayName === 'Sunday') {
            setError('Please choose a weekday for a due date.');
            return false;
        }
        setDateValue(date);
        setTimeValue(date);
        dueDateRef.current.value = formatDate(date);
        dueDateTimeRef.current.value = formatTime();
    }

    // const onClickDay = (date, event) => {
        
    //     dueDateRef.current.value = formatDate(date);
    // }

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        date.setHours(8);
        date.setMinutes(30);

        const formattedDate = `${month}/${day}/${year}`;
        return formattedDate;
    }

    const formatTime = () => {
        const date = dateValue;
        date.setHours(8);
        date.setMinutes(30);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;
        return formattedTime;
    }

    const handleSaveDueDate = () => {
        const dueDate = dateValue.toISOString();
        updateTask(taskId, {...task, dueDate});
        setTask(prevTask => ({...prevTask, dueDate}));
        onCloseFlyout(); 
    }

    const handleRemoveDueDate = () => {
        updateTask(taskId, {...task, dueDate: ''});
        setTask(prevTask => ({...prevTask, dueDate: ''}));
        onCloseFlyout();
    }

    return (
        <div className='max-w-[300px] p-2 text-sm font-medium'>
            <Calendar onChange={handleChange} value={dateValue} />
            <div className='my-4'>
                {error &&
                    <p className='text-red-600'>{error}</p>
                }
                <p>Due Date</p>
                <div className='flex items-start gap-[10px]'>
                    <input className='border p-1 flex-shrink-0 flex-grow-0 w-[80px]' ref={dueDateRef} defaultValue={formatDate(dateValue)} />
                    <input className='border p-1 flex-shrink-0 flex-grow-0 w-[80px]' ref={dueDateTimeRef} defaultValue={formatTime()} />
                </div>
            </div>

            <button onClick={handleSaveDueDate} className='p-2 rounded-sm bg-primary-700 text-white text-center w-full my-1'>Save</button>
            <button onClick={handleRemoveDueDate} className='p-2 rounded-sm bg-gray-100 text-gray-700 text-center w-full my-1'>Remove</button>
        </div>
    )
}

export default TaskDates;