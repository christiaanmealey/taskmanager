import { ObjectId } from "mongodb";
import { 
    findAllProjects, 
    findProjectById, 
    createProject as modelCreateProject, 
    updateProject as modelUpdateProject, 
    deleteProject as modelDeleteProject 
} from "../models/projectModel.js";

export async function getProjects() {
    try {
        const result = await findAllProjects();
        return result;   
    } catch (error) {
        throw error;
    }
}

export async function getProject(id) {
    try {
        const oid = new ObjectId(id);
        const query = {_id: oid};
        const result = await findProjectById(query);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function createProject(project) {
    try {
        const result = await modelCreateProject(project);
        const projectId = result._id;
        const newProject = await findProjectById(projectId);
        return newProject;
    } catch (error) {
        throw error;
    }
}

export async function createProjectStage(projectId, stage) {
    try {
        const oid = new ObjectId(projectId);
        const query = {_id: oid};
        const update = {$push: {stages: stage}, $set: {updatedAt: new Date()}};
        const result = await modelUpdateProject(query, update);
        const newProject = await findProjectById(projectId);
        return newProject;
    } catch (error) {
        throw error;
    }
}

export async function updateProject(id, project) {
    const oid = new ObjectId(id);
    const query = {_id: oid};
    const update = {$set: project};

    try {
        const result = await modelUpdateProject(query, update);
        const updatedProject = await findProjectById(id);
        return updatedProject;
    } catch (error) {
        throw error;
    }
}

export async function updateProjectStage(projectId, stage) {
    const oid = new ObjectId(projectId);
    const query = {_id: oid, 'stages._id': stage._id};
    const update = {$set: {
        "stages.$.name": stage.name, 
        "stages.$.order": stage.order, 
        "stages.$.color": stage.color, 
        "stages.$.updatedAt": new Date(),
        "stages.$.isArchived": stage.isArchived
    }};

    try {
        const result = await modelUpdateProject(query, update);
        const updatedProject = await findProjectById(projectId);
        return updatedProject;
    } catch (error) {
        throw error;
    }
}

export async function deleteProject(id) {
    try {
        const oid = new ObjectId(id);
        const query = {_id: oid};
        const result = await modelDeleteProject(query);
        return result;
    } catch (error) {
        throw error;
    }   
}