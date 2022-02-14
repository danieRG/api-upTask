const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
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
    }
});

module.exports = mongoose.model('Project', ProjectSchema);