const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
    problemId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    difficulty: { type: String, required: true },
    category: { type: String, required: true },
    acceptance: { type: String, required: true },
    description: { type: String, required: true },
    constraints: [{ type: String }],
    templates: {
        python: { type: String, required: true },
        java: { type: String, required: true },
        c: { type: String, required: true }
    },
    testCases: [{
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true }
    }]
});

module.exports = mongoose.model('Problem', ProblemSchema);