import { Link } from "react-router-dom";
import { BugAntIcon } from "@heroicons/react/24/solid";

function Header() {
    return (
        <div className="w-full flex items-center justify-start py-2 pl-4 border-b bg-white]">
            <div className="logo border-2 bright-blue-border bg-[#00a6fb] bg-gradient-to-tl from-[#034d6e]  rounded-full p-1 mr-4">
                <BugAntIcon className="size-8 text-white" />
            </div>
            <div>

                <header className="App-header">
                    <nav>
                        <ul className="dark-blue-txt">
                            <li><Link to="/">Dashboard</Link></li>
                            <li><Link to="/tasks/">Tasks</Link></li>
                            <li><Link to="/projects">Projects</Link></li>
                            <li><Link to="/settings">Settings</Link></li>
                        </ul>
                    </nav> 
                </header>
            </div>
        </div>
    );
}

export default Header;