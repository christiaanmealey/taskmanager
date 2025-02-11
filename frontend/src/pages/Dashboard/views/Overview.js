import { useAuth } from "../../../context/AuthContext/AuthContext";
import { useState, useEffect, useRef } from "react";
import { CChart } from '@coreui/react-chartjs';

function Overview() {
    const [tasks, setTasks] = useState([]);
    const [statusCounts, setStatusCounts] = useState([]);
    const { token, isAuthenticated } = useAuth();
    const chartRef = useRef();
    
    useEffect(() => {
        const fetchItems = async() => {      
          try {
            const response = await fetch('http://localhost:3000/tasks', {headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`
            }});
            const data = await response.json();
            const tData = Array.from(data);
            const statusCounts = tData.reduce((acc, task) => {
                const found = acc.find(item => item.status === task.status);
                if(found) {
                    found.count++;
                } else {
                    acc.push({status: task.status, count: 1});
                }
                return acc;
            }, []);
            setStatusCounts(statusCounts);
            setTasks(data);
          } catch (error) {
            console.error(error);
          }
        }
        if(token) {
          fetchItems();
        }
      }, [token]);
      const filterTasks = () => {
        const tasksFiltered = tasks.filter(task => task.status !== 'completed');
        return [...tasksFiltered];
      }
    return (
        <div className="w-full">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-1 bg-gray-50 px-4 pt-1 pb-4 shadow border border-gray-200 border-opacity-30 flex flex-col">
                    <p>Total tasks/Tasks open</p>
                    <div className="m-auto font-medium text-4xl text-center py-2 flex flex-col justify-center align-middle">
                        {tasks.length}/{filterTasks().length}
                    </div>
                </div>
                <div className="col-span-1 bg-gray-50 px-4 pt-1 pb-4 shadow border border-gray-200 border-opacity-30">
                    <p>Statuses</p>
                    <div className="m-auto font-medium text-sm text-center py-2">
                        {
                            statusCounts.map((item, index) =>
                                <p className="inline-flex m-2 text-gray-700" key={index}>{item.status.toUpperCase()}: <span className="font-bold text-gray-900 ml-2"> {item.count}</span></p>
                            )
                        }
                    </div>
                </div>
            </div>
            
            <div ref={chartRef} id="taskChart" className="w-2/5 m-auto">
                <CChart
                    type="doughnut"
                    data={{
                        labels: statusCounts.map(task => task.status),
                        datasets: [
                        {
                            backgroundColor: ['#1b98e0', '#ff3d00', '#ff6b6b', '#ff8a5b', '#028090'],
                            data: statusCounts.map(task => task.count),
                        },
                        ],
                    }}
                    options={{
                        plugins: {
                        legend: {
                            labels: {
                            color: '#41B883',
                            }
                        }
                        },
                    }}
                />
            </div>
        </div>
    )
}

export default Overview;