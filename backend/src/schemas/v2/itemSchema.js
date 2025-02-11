import mongoose, { Schema } from "mongoose";

const itemSchema = new mongoose.Schema({
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required:true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String },
    owner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    customData: { type: Map, of: Schema.Types.Mixed }
});