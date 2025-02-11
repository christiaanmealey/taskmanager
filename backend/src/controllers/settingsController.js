import asyncHandler from 'express-async-handler';
import { 
    getSetting, 
    getSettings,
    createSetting as serviceCreateSetting,
    updateSetting as serviceUpdateSetting,
    deleteSetting as serviceDeleteSetting 
} from '../services/settingsService.js';
// import validators from '../validators/index.js';

export const fetchSettings = asyncHandler(async(req, res) => {
    try {
        const result = await getSettings();
        res.status(200).json(result);        
    } catch (error) {
        console.error('error fetching settings', error);
        res.status(500).json({error: error.message});
    }
});

export const fetchSetting = asyncHandler(async(req, res) => {
    try {
        const result = await getSetting(req.params.type);
        res.status(200).json(result);
    } catch (error) {
        console.error('error fetching setting', error);
        res.status(500).json({error: error.message});
    }
});

export const createSetting = asyncHandler(async(req, res) => {
    // const validate = validators.settingSchema;
    // const isValid = validate(req.body);

    // if(!isValid) {
    //     console.error('error validating setting', validate.errors);
    //     return res.status(400).json({error: validate.errors});
    // }
    try {
        const result = await serviceCreateSetting(req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error(`error creating setting`, error);
        res.status(500).json({error: error.message});
    }
});

export const updateSetting = asyncHandler(async(req, res) => {
    // const validate = validators.settingSchema;
    // const isValid = validate(req.body);

    // if(!isValid) {
    //     console.error('error validating setting', validate.errors);
    //     return res.status(400).json({error: validate.errors});
    // }
    try {
        const result = await serviceUpdateSetting(req.params.id, req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error(`error updating setting: ${req.params.id}`, error);
        res.status(500).json({error: error.message});
    }
});

export const deleteSetting = asyncHandler(async(req, res) => {
    try {
        const result = serviceDeleteSetting(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        console.error(`error deleting setting with ID: ${req.params.id}`, error);
        res.status(500).json({error: error.message});
    }
})