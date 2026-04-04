const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        const problems = await Problem.find().sort({ problemId: 1 });
        let solvedIds = [];
        if (userId && userId !== 'null') {
            const user = await User.findById(userId);
            if (user) {
                solvedIds = user.solvedProblems.map(id => id.toString());
            }
        }
        const problemsWithStatus = problems.map(p => {
            const problemObj = p.toObject();
            return {
                ...problemObj,
                status: solvedIds.includes(p._id.toString()) ? "solved" : "unsolved"
            };
        });
        res.json(problemsWithStatus);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch problems" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(404).json({ error: "Problem not found" });
        res.json(problem);
    } catch (err) {
        res.status(404).json({ error: "Problem not found" });
    }
});

router.post('/complete-lesson', async (req, res) => {
    try {
        const { userId, lessonId } = req.body;
        const user = await User.findById(userId);
        
        if (!user) return res.status(404).json({ error: "User not found" });

        // Force initialize if structure is broken
        if (!user.completedLessons || Array.isArray(user.badges)) {
            user.completedLessons = [];
            user.badges = { bronze: false, silver: false, gold: false };
        }

        if (!user.certificates || Array.isArray(user.certificates)) {
            user.certificates = { 
                pythonMasterclass: false, 
                javaMastery: false, 
                cMastery: false, 
                allProblemsComplete: false 
            };
        }

        if (!user.completedLessons.includes(lessonId)) {
            user.completedLessons.push(lessonId);
        }

        if (lessonId === 'python') user.certificates.pythonMasterclass = true;
        if (lessonId === 'java') user.certificates.javaMastery = true;
        if (lessonId === 'c') user.certificates.cMastery = true;

        user.markModified('certificates');
        user.markModified('badges');
        user.markModified('completedLessons');

        await user.save();
        res.json({ message: "Certificate awarded successfully", completedLessons: user.completedLessons });
    } catch (err) {
        console.error("CRITICAL BACKEND ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;