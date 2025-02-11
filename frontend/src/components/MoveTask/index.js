import { useState, useEffect, useRef } from "react";
import useProjectContext from "../../context/ProjectContext/useProjectContext";
import useTasksContext from "../../context/TaskContext/useTasksContext";

function MoveTask({taskId, stageName, onCloseFlyout}) {
    const { selectedProject, projects } = useProjectContext();
    const { updateTask } = useTasksContext();
    const moveTaskRef = useRef(null);
    const [selectedMoveProject, setSelectedMoveProject] = useState(selectedProject);
    const [selectedMoveList, setSelectedMoveList] = useState(stageName);

    const handleSelect = (e) => {
        const projectId = e.target.value;
        const project = projects.find(p => p._id === projectId);
        setSelectedMoveProject(prevProject => project);
    }
    
    const handleSelectList = (e) => {
        if(e.target.value !== stageName) {
            setSelectedMoveList(e.target.value);
        }
    }
    const handleMove = () => {
        if(selectedProject._id === selectedProject._id && selectedMoveList === stageName) {
            return onCloseFlyout();
        }
        updateTask(taskId, {projectId: selectedMoveProject._id, stage: selectedMoveList});
        onCloseFlyout();
    }
    return (
        <div className="text-left">
            <p className="capitalize mb-2">Select destination</p>
            <select onChange={(e) => handleSelect(e)} className="p-2 border focus:outline-transparent border-gray-200" ref={moveTaskRef}>
                {projects.map(project =>
                    <option 
                        value={project._id}
                        selected={project.projectName === selectedProject.projectName}>
                        {project.projectName}
                    </option>
                )}
            </select>
            <p className="capitalize mb2 mt-4">Select List</p>
            <select onChange={(e) => handleSelectList(e)} className="p-2 border focus:outline-transparent border-gray-200">
                {selectedMoveProject.stages.map(stage =>
                    <option 
                        value={stage.name}
                        selected={stage.name === selectedMoveList}>
                        {stage.name}
                    </option>
                )}
            </select>
            <button onClick={() => handleMove()} className="bright-blue-bg text-white rounded-md mt-4 mb-1 px-2 py-1">Move</button>
        </div>
    )
}

export default MoveTask;