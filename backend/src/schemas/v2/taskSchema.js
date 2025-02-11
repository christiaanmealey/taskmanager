import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dueDate: { type: Date },
    priority: { type: String },
    taskStatus: { type: String },
    stage: { type: String, required: true },
    checklist: { type: Array }, // expand this later
});

const Task = mongoose.model('Task', taskSchema);

export default Task;