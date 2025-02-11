import Setting from "../schemas/settingSchema.js";

export async function findSettings() {
    try {
        const result = await Setting.find({});
        return result;
    } catch (error) {
        console.error(`error fetching settings from database`, error);
        throw error;
    }
}

export async function findSetting(query) {
    try {
        const result = await Setting.findOne({query});
        return result;
    } catch (error) {
        console.error(`error fetching setting from database with tpe: ${JSON.stringify(query)}`, error);
        throw error;
    }
}

export async function createSetting(setting) {
    try {
        const result = await Setting.create(setting);
        return result;    
    } catch (error) {
        console.error(`error inserting setting into database`, error);
        throw error;
    }
}

export async function updateSetting(query, update) {
    try {
        const result = await Setting.updateOne(query, update);
        return result;
    } catch (error) {
        console.error(`error updating setting options of setting type: ${JSON.stringify(query)}`, error);
        throw error;  
    }
}

export async function deleteSetting(query) {
    try {
        const result = await Setting.deleteOne(query);
        return result;
    } catch (error) {
        console.error(`error deleting setting with ID: ${JSON.stringify(query)}`, error);
        throw error;
    }
}