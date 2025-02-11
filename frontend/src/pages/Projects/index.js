import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
import useProjectContext from "../../context/ProjectContext/useProjectContext";
import useWebSocketContext from "../../context/WebSocketContext/useWebSocketContext";
import ProjectCard from "../../components/ProjectCard";
import './Projects.css';
import Modal from "../../components/Modal";
import useClickOutside from "../../hooks/useClickOutside";

function Projects () {
    const { token, isAuthenticated, login, user } = useAuth();
    const { projects, setProjects, loading, error, addProject, updateProject } = useProjectContext();
    const { socket, sendMessage, messages } = useWebSocketContext();
    const [workspaces, setWorkspaces] = useState([{name: "Christiaan's workspace"}]);
    const newProjectTitleRef = useRef(null);
    const [showCreateProject, setShowCreateProject] = useState(false);
    const navigate = useNavigate();

    const handleClickOutside = useCallback(() => {
        setShowCreateProject(false);
        newProjectTitleRef.current.value = '';
    }, [showCreateProject]);

    useClickOutside(newProjectTitleRef, handleClickOutside);

    useEffect(() => {
        if(!isAuthenticated) {
            //temporary force login
            login({'email': 'chris.mealey@gmail.com', 'password': 'cgcfad6799'});
            //navigate('/login');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        console.log(messages);
    }, [messages]);
    /* websocket updates */
    useEffect(() => {
        if(socket.current) {
            socket.current.on('message', (event) => {
                //ignore if message initiator
                console.log(socket.current.id, event.message.sender);
                if(socket.current.id === event.message.sender) {

                } else {
                    if(event?.message?.type === 'project:add') {
                        setProjects(prev => [...prev, event.message.payload]);
                    }
                }
            });
            return () => {
                socket.current.off('message');
            }
        }
    }, []);

    useEffect(() => {
        if(showCreateProject) {
            setTimeout(() => {
                newProjectTitleRef.current.focus();
            }, 0);
        }
    }, [showCreateProject]);

    const handleOpenModal = () => {
        setShowCreateProject(true);
        newProjectTitleRef.current.focus();
    }

    const handleUpdateProject = (project, update) => {
        updateProject(project._id, update);
    }

    const handleCreateProject = (e) => {
        if(e.key === 'Enter') {
            const projectTitle = newProjectTitleRef.current.value;
            addProject({projectName: projectTitle}, socket.current.id);
            newProjectTitleRef.current.value = '';
            setShowCreateProject(false);
        } else {
            return;
        }
    }

    return (
        <div className="max-w-[1200px] m-auto">
            <div className="flex min-h-screen">

                <div className="w-64 dark-blue-txt font-medium p-5">
                    <ul className="mt-4 space-y-1">
                        <li className="bg-gray-200 px-2 py-1 rounded-md bright-blue-txt">Projects</li>
                        <li className="px-2 py-1">Home</li>
                        <li className="divider border border-b-2 border-gray-200"></li>
                        <li className="px-2 py-1 subhead">Workspaces</li>
                        <li className="px-2 py-1">Placeholder Workspace</li>
                        <li className="px-2 py-1">Another</li>
                    </ul>
                </div>
                <div className="flex-1 p-6 items-start justify-between ">
                    {workspaces.map((workspace, index) =>
                        <div key={index} className="workspace grid grid-cols-4 gap-4">
                            <h1 className="dark-blue-txt text-2xl col-span-4">{ workspace.name }</h1>
                            {projects.map((project, projectIndex) =>                 
                                <ProjectCard key={project._id} project={project} onUpdateProject={handleUpdateProject} />
                            )}
                            <div className="
                                group 
                                col-span-1 project-card drop-shadow-md rounded-sm
                                text-white font-medium text-sm 
                                bg-[#00a6fb] brightness-90"
                            >
                                <div
                                    className="h-24 mt-1 flex items-center justify-center cursor-pointer"
                                    onClick={handleOpenModal}
                                >
                                    <p>Create New Project</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Modal openModal={showCreateProject} closeModal={() => {newProjectTitleRef.current.value = ''; setShowCreateProject(false)}}>
                <input className="px-2 py-1 focus:outline-1 focus:outline-blue-400 text-3xl" autoFocus ref={newProjectTitleRef} onKeyDown={handleCreateProject} type="text" placeholder="Project Name..." />
            </Modal>
        </div>
    )
}

export default Projects;