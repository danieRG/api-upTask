const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now()
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    status: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Task', TaskSchema);