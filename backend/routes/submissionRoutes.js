const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const User = require('../models/User');

router.post('/submit', async (req, res) => {
try {
const { userId, problemId, code, language, status, runtime, memory, actualOutput, failedCase } = req.body;
const newSubmission = new Submission({
userId,
problemId,
code,
language,
status,
runtime,
memory,
actualOutput,
failedCase
});
await newSubmission.save();
if (status === 'Accepted') {
const user = await User.findById(userId);
if (user && !user.solvedProblems.includes(problemId)) {
user.solvedProblems.push(problemId);
user.solvedCount = user.solvedProblems.length;
if (user.solvedCount >= 10) user.badges.bronze = true;
if (user.solvedCount >= 25) user.badges.silver = true;
if (user.solvedCount >= 50) user.badges.gold = true;
await user.save();
}
}
res.status(201).json(newSubmission);
} catch (error) {
res.status(400).json({ message: error.message });
}
});

router.get('/user/:userId', async (req, res) => {
try {
const history = await Submission.find({ userId: req.params.userId }).sort({ submittedAt: -1 });
res.json(history);
} catch (error) {
res.status(500).json({ message: error.message });
}
});

router.get('/user/:userId/problem/:problemId', async (req, res) => {
try {
const { userId, problemId } = req.params;
const history = await Submission.find({ userId, problemId }).sort({ submittedAt: -1 });
res.json(history);
} catch (error) {
res.status(500).json({ message: error.message });
}
});

module.exports = router;