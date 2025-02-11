import { useState } from "react";

export const useDragAndDrop = (task, setTask) => {
    const [draggedTaskId, setDraggedTaskId] = useState(null);

    const onDragStart = (e, taskId) => {
        e.preventDefault();
        setDraggedTaskId(taskId);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = (e, targetTaskId) => {
        e.preventDefault();
    
        if (draggedTaskId === targetTaskId) return; // Don't do anything if dropped on itself
    
        const updatedTasks = tasks.map(task => {
          if (task.id === draggedTaskId) {
            return { ...task, order: targetTaskId }; // Set new order
          } else if (task.id === targetTaskId) {
            return { ...task, order: draggedTaskId }; // Set new order for the target
          }
          return task;
        });
    
        // Sort tasks by order (or any other field you are using to determine order)
        updatedTasks.sort((a, b) => a.order - b.order);
        setTasks(updatedTasks);
        setDraggedTaskId(null); // Reset the dragged task
      };
    
      return { onDragStart, onDragOver, onDrop };
}