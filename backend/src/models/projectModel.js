import Project from "../schemas/projectSchema.js";

export async function findAllProjects() {
    try {
        const result = await Project.find({});
        return result;
    } catch (error) {
        console.error(`error fetching projects from database`, error);
        throw error;
    }
}

export async function findProjectById(id) {
    try {
        const result = await Project.findById(id);
        return result;
    } catch (error) {
        console.error(`error fetching project ID: ${id}`);
        throw error;
    }
}

export async function createProject(project) {
    try {
        const result = await Project.create(project);
        return result;
    } catch (error) {
        console.error(`error creating new project in database`, error);
        throw error;
    }
}

export async function updateProject(query, update) {
    try {
        const result = await Project.updateOne(query, update);
        return result;
    } catch (error) {
        console.error(`error updating project with ID: ${query._id}`, error);
        throw error;
    }
}

export async function deleteProject(query) {
    try {
        const result = await Project.deleteOne(query);
        return result;
    } catch (error) {
        console.error(`error deleting project with ID: ${query._id}`, error);
        throw error;
    }
}