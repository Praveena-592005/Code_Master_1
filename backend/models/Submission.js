const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Problem', 
        required: true 
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    status: { 
        type: String, 
        enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Pending', 'Failed'], 
        required: true 
    },
    runtime: {
        type: Number
    },
    memory: {
        type: String
    },
    actualOutput: {
        type: String
    },
    failedCase: {
        input: String,
        expected: String,
        actual: String
    },
    submittedAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Submission', SubmissionSchema);