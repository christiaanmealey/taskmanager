import mongoose from 'mongoose';

const spaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})