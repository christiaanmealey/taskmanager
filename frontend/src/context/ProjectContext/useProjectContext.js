import { useContext } from "react";
import { ProjectContext } from "./ProjectContextProvider";

export default function useProjectContext() {
    const context = useContext(ProjectContext);

    if(!context) {
        throw new Error('useProjects must be used withing a ProjectContextProvider')
    }

    return context;
}