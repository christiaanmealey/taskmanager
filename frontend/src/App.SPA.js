import Header from "./components/Header";
import {BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import { useAuth } from "./AuthContext.js";
import Login from "./pages/Login/Login.js";
import Modal from "./components/Modal/index.js";
import './App.css';
import { useEffect, useState, useRef } from "react";
import AddProject from "./components/AddProject/index.js";
import AddTask from "./components/AddTask/index.js";

function App() {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [project, setProject] = useState([]); 
  const [addProjectModal, setAddProjectModal] = useState(false);
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [onAddTask, setOnAddTask] = useState(true);
  const {isAuthenticated, token} = useAuth();
  const [addTaskTrigger, setAddTaskTrigger] = useState(false);

  useEffect(() => {
    console.log('change');
    const fetchItems = async() => {      
      try {
        console.log('fetching projects');
        const response = await fetch('http://localhost:3000/projects', {headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        }});
        const data = await response.json();
        setProjects(data);
        setProject(data[0]);
      } catch (error) {
        console.error(error);
      }
    }
    if(token) {
      fetchItems();
    }
  }, [token]);

  useEffect(() => {
    console.log('top', addTaskTrigger);
  }, [addTaskTrigger]);
  
  const handleClick = (e) => {
    const el = e.currentTarget;
    setCurrentIndex([...el.parentElement.children].indexOf(el)-1);
    
    if(currentIndex >= 0 && project < projects.lengt) {
      setProject(projects[currentIndex]);
    }
    el.scrollIntoView({behavior: "smooth", inline: "center"});
  }

  return (
    <div className="app-container pastel-blue-bg">
      <Modal openModal={addProjectModal} closeModal={() => setAddProjectModal(false)}>
          <AddProject closeModal={() => setAddProjectModal(false)} />
      </Modal>

      <Modal openModal={addTaskModal} closeModal={() => setAddTaskModal(false)}>
          <AddTask triggerOnAddTask={() => setAddTaskTrigger((prev) => !prev)} projectId={project?._id} closeModal={() => setAddTaskModal(false)} />
      </Modal>

      <Header />
      <Router>
        <div>
          <div className="headerNav">
            <nav>
                <ul>
                  <li id="starredItem" onClick={handleClick} className={-1 === currentIndex ? 'nav-items active' : 'nav-items'}>★</li>
                  {
                      projects.map((project, projectIndex) => 
                          <li id={project._id} onClick={handleClick} className={projectIndex === currentIndex ? 'nav-items active' : 'nav-items'} key={project._id}>{project.projectName}</li>
                      )
                  }    
                  <li id="newItem" onClick={() => setAddProjectModal(true)} className={projects.length === currentIndex ? 'nav-items active' : 'nav-items'}>+ Add Project</li>
                </ul>
            </nav>
          </div>
          <div className="container">
            <Routes>
                <Route path="/" element={<Home project={projects[currentIndex]} onAddTask={() => setOnAddTask(true)} />} />
                <Route path="/about" element={<About/>} />
                <Route path="/login" element={<Login/>} />
            </Routes>
          </div>
        </div>
      </Router>
      <button id="globalAddTaskBtn" onClick={() => setAddTaskModal(true)}>+</button>
    </div>
  );
}

export default App;
