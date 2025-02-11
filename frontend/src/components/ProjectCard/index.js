import { useState } from "react";
import { Link } from "react-router-dom";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

function ProjectCard({project, onUpdateProject}) {
    const [isStarred, setIsStarred] = useState(project?.starred);

    const handleFavoriteClick = (e, project) => {
        e.preventDefault();
        onUpdateProject(project, {starred: !isStarred});
    }

    return (
        <Link to={`/projects/${project._id}`} state={{project}}>    
            <div className="
                p-3 group
                col-span-1 project-card drop-shadow-md rounded-sm
                text-white font-medium text-sm 
                border bg-[#00a6fb] bg-gradient-to-tl from-[#136c9e] dark-blue-border"
            >
                <div className="flex h-20">
                    <div className="w-full">
                        <h1 className="project-title">
                            {project.projectName}
                        </h1>
                    </div>
                    <div className="flex items-end justify-end w-full">
                        {project.starred &&
                            <StarIcon onClick={(e) => handleFavoriteClick(e, project)} className="size-4" />
                        }
                        {!project.starred &&
                            <StarIconOutline onClick={(e) => handleFavoriteClick(e, project)} className="size-4 hidden group-hover:block" />
                        }
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProjectCard;