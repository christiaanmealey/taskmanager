import mongoose from "mongoose";

const stageSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId()},
    name: { type: String, required: true },
    order: { type: Number, required: true },
    color: { type: String, default: ''},
    isArchived: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const projectSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    description: { type: String },
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dueDate: { type: Date, default: Date.now },
    priority: { type: String },
    status: { type: String },
    stages: [stageSchema],
    starred: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);

export default Project;