import { ObjectId } from "mongodb";
import { 
    findSetting, 
    findSettings,
    createSetting as modelCreateSetting,
    updateSetting as modelUpdateSetting,
    deleteSetting as modelDeleteSetting 
} from "../models/settingsModel.js";

export async function getSettings() {
    try {
        const result = await findSettings();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getSetting(type) {
    try {
        const result = await findSetting(type);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function createSetting(setting) {
    try {
        const result = await modelCreateSetting(setting);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function updateSetting(id, settingOptions) {
    const oid = new ObjectId(id);
    const query = {_id: oid};
    const update = {$set: settingOptions};
    try {
        const result = await modelUpdateSetting(query, update);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function deleteSetting(id) {
    const oid = new ObjectId(id);
    const query = {_id: oid};
    try {
        const result = await modelDeleteSetting(query);
        return result;
    } catch (error) {
        throw error;
    }
}