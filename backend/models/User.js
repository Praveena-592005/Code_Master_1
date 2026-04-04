const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    completedLessons: { type: [String], default: [] },
    solvedCount: { type: Number, default: 0 },
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    badges: {
        bronze: { type: Boolean, default: false },
        silver: { type: Boolean, default: false },
        gold: { type: Boolean, default: false }
    },
    certificates: {
        pythonMasterclass: { type: Boolean, default: false },
        javaMastery: { type: Boolean, default: false },
        cMastery: { type: Boolean, default: false },
        allProblemsComplete: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);