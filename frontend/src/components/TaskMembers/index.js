import { useState, useEffect } from "react";
import { XMarkIcon, UserCircleIcon } from "@heroicons/react/24/solid";

function TaskMembers ({members, closeFlyout, onRemoveMember}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMembers, setFilteredMembers] = useState(members);

    useEffect(() => {
        const filtered = members.filter(member => 
            member.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMembers(filtered);
    }, [members, searchTerm]);

    const handleRemoveMember = (member) => {
        const filtered = filteredMembers.filter(_member => 
            _member.username !== member.username 
        )
        setFilteredMembers(filtered);
        onRemoveMember(member);
    }
    return (
        <div className="">
            <input 
                className="bg-gray-50 outline-none text-gray-900 p-2 text-sm border rounded-md hover:brightness-90 border-gray-300 focus-visible:border-blue-400" 
                autoFocus 
                onChange={(event) => setSearchTerm(event.target.value)} 
                placeholder="Search members"
            />
            <div className="px-1 py-2 mt-2">
                <p className="text-xs mb-2 font-medium">Task members</p>
                <ul>
                    {filteredMembers.map((member, index) => 
                        <li
                            className="bg-gray-100 px-2 text-gray-800 py-2 mb-2 flex justify-between items-center" 
                            key={index}
                        >
                            <span className="user-icon">
                                {/* add real user icon later */}
                                <UserCircleIcon className="size-9" />
                            </span>
                            <span className="user-name text-left flex-grow ml-2">
                                {member.username}
                            </span>
                            <span className="remove-user">
                                <button onClick={() => handleRemoveMember(member)}>
                                    <XMarkIcon className="size-4 font-bold" />
                                </button>
                            </span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default TaskMembers;