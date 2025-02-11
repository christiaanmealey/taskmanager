import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext/AuthContext';
import { TaskContextProvider } from "./context/TaskContext/TaskContextProvider";
import { ProjectContextProvider } from "./context/ProjectContext/ProjectContextProvider";
import { WebSocketContextProvider } from './context/WebSocketContext/WebSocketContextProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
const socketURL = 'http://localhost:8000/';
root.render(
    <AuthProvider>
      <ProjectContextProvider>
        <TaskContextProvider>
          <WebSocketContextProvider wsURL={socketURL}>
            <App />
          </WebSocketContextProvider>
        </TaskContextProvider>
      </ProjectContextProvider>
    </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
