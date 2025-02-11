import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext/AuthContext.js";
import SideBar from "../../components/Sidebar";
import Overview from "./views/Overview.js";
import Projects from "./views/Projects.js";
import Calendar from "./views/Calendar.js";
import Reports from "./views/Reports.js";
import Settings from "./views/Settings.js";

function Dashboard() {
    const [navItems, setNavItems] = useState([
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Projects', path: '/projects' },
        { name: 'Calendar', path: '/calendar' },
        { name: 'Reports', path: '/reports' },
        { name: 'Settings', path: '/settings' },
    ]);
    const [currentView, setCurrentView] = useState('Dashboard');
    
    const {isAuthenticated, token, user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(!isAuthenticated) {
            navigate('/login');
        }
    else {
        console.log(user.role);
        if(user.role !== 'admin') navigate('/tasks');
        }
    }, [isAuthenticated]);

    const changeView = (view) => {
        setCurrentView(view);
    };

    const renderView = () => {
        switch(currentView) {
            case "Dashboard":
                return <Overview />
            break;
            case "Projects":
                return <Projects />
            break;
            case "Calendar":
                return <Calendar />
            break;
            case "Reports":
                return <Reports />
            break;
            case "Settings":
                return <Settings />
            break;
        }
    }

    return (
        <div className="w-full grid grid-cols-4 bg-white shadow-lg min-h-[calc(100vh-20em)]">
            <div className="col-span-1 m-auto h-full">
                <SideBar onChangeView={changeView} navItems={navItems} />
            </div>
            <div className="col-span-3 p-4">
                {renderView()}
            </div>
        </div>
    )
}

export default Dashboard;