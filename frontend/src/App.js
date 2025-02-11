import Header from "./components/Header";
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import { useAuth } from "./context/AuthContext/AuthContext";
import Login from "./pages/Login";
import './App.css';
import { useEffect, useState, useRef } from "react";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Projects from "./pages/Projects";
import Project from "./pages/Project";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const {isAuthenticated, token, user} = useAuth();

  
  const handleClick = (e) => {
    const el = e.currentTarget;
    setCurrentIndex([...el.parentElement.children].indexOf(el)-1);
  }

  return (
    <div className="w-full min-h-screen items-center bg-gray-50">
      <Router>
        <div className="w-full">
          {isAuthenticated && 
            <Header />
           }
          <div className="w-full max-h-screen">
            <Routes>
                <Route path="/" element={<Projects/>} />
                <Route path="/projects" element={<Projects/>} />
                <Route path="/tasks/" element={<Tasks manualTrigger={true}/>} />
                <Route path="/projects/:id" element={<Project />} />
                <Route path="/login" element={<Login/>} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
