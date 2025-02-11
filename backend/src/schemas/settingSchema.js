import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
    type: { type: String, required: true },
    settings: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;