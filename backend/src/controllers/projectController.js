//only router calls this controller for now
import asyncHandler from 'express-async-handler';
// controller uses service methods
import { 
    getProjects,
    getProject,
    createProject as serviceCreateProject,
    updateProject as serviceUpdateProject,
    deleteProject as serviceDeleteProject,
    createProjectStage as serviceCreateProjectStage,
    updateProjectStage as serviceUpdateProjectStage
} from '../services/projectService.js';
// import validators from '../validators/index.js';

// export async express route callbacks for project routes with service calls
export const fetchProjects = asyncHandler(async(req, res) => {
    try {
        const projects = await getProjects();
        res.status(200).json(projects);
    } catch (error) {
        console.error('error fetching projects', error);
        res.status(500).json({error: error.message});
    }
});

export const fetchProject = asyncHandler(async(req, res) => {
    try {
        const projectId = req.params.id;
        const project = await getProject(projectId);
        res.status(200).json(project);
    } catch (error) {
        console.error(`error fetching project by ID: ${req.params.id}`, error);
        res.status(500).json({error: error.message});
    }
});

export const createProject = asyncHandler(async(req, res) => {
    try {
        const project = req.body;
        const result = await serviceCreateProject(project);
        res.status(200).json(result);
    } catch (error) {
        console.error(`error creating project`, error);
        res.status(500).json({error: error.message});
    }
});

export const createProjectStage = asyncHandler(async(req, res) => {
    try {
        const projectId = req.params.id;
        const stage = req.body;
        const result = await serviceCreateProjectStage(projectId, stage);
        res.status(200).json(result);
    } catch (error) {
        console.error(`error creating project`, error);
        res.status(500).json({error: error.message});
    }
});

export const updateProject = asyncHandler(async(req, res) => {
    try {
        const id = req.params.id;
        const project = req.body;
        const result = await serviceUpdateProject(id, project);
        res.status(200).json(result);
    } catch (error) {
        console.error(`error updating project with ID: ${req.params.id}`, error);
        res.status(500).json({error: error.message});
    }
});

export const updateProjectStage = asyncHandler(async(req, res) => {
    try {
        const projectId = req.params.id;
        const stage = req.body;
        const result = await serviceUpdateProjectStage(projectId, stage);
        res.status(200).json(result);
    } catch (error) {
        console.error(`error updating project with ID: ${req.params.id}`, error);
        res.status(500).json({error: error.message});
    }
});

export const deleteProject = asyncHandler(async(req, res) => {
    try {
        console.log(req.params);
        const projectId = req.params.id;
        const result = await serviceDeleteProject(projectId);
        res.status(200).json(result);
    } catch (error) {
        console.error(`error deleting project with ID: ${req.params.id}`);
        res.status(500).json({error: error.message});
    }
});