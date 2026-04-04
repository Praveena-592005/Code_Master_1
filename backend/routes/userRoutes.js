const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/profile/:id', async (req, res) => {
try {
const user = await User.findById(req.params.id);
if (!user) return res.status(404).json({ message: "User not found" });
res.json(user);
} catch (err) {
res.status(500).json({ message: "Server error fetching profile" });
}
});

router.put('/update/:id', async (req, res) => {
try {
const { name, email } = req.body;
const updatedUser = await User.findByIdAndUpdate(
req.params.id,
{ name, email },
{ new: true }
);
if (!updatedUser) return res.status(404).json({ message: "User not found" });
res.json(updatedUser);
} catch (err) {
res.status(500).json({ message: "Update failed" });
}
});

router.post('/complete-lesson', async (req, res) => {
try {
const { userId, courseId } = req.body;
const user = await User.findById(userId);
if (!user) return res.status(404).json({ message: "User not found" });
if (!user.completedLessons.includes(courseId)) {
user.completedLessons.push(courseId);
await user.save();
}
res.status(200).json({ message: "Progress saved", completedLessons: user.completedLessons });
} catch (err) {
res.status(500).json({ message: "Failed to save progress" });
}
});

module.exports = router;