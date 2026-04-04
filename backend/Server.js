const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Models
const Problem = require('./models/Problem');
const Submission = require('./models/Submission');
const User = require('./models/User');

// Routes
const problemRoutes = require('./routes/problemRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection Logic (Uses Render Environment Variable or Localhost)
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/coding_platform';

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// Route Handlers
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/user', userRoutes);

// Authentication: Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.create({ name, email, password });
        res.status(201).json({ userId: user._id, name: user.name, email: user.email });
    } catch (err) {
        res.status(400).json({ error: "Email already exists or invalid data" });
    }
});

// Authentication: Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        res.json({ userId: user._id, name: user.name, email: user.email });
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

// Code Execution Engine
app.post('/api/execute', async (req, res) => {
    const { script, language, problemId, isSubmit, userId } = req.body;
    const jobId = Date.now();
    const jobDir = path.join(__dirname, `job_${jobId}`);

    try {
        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ error: "Problem not found" });

        if (!fs.existsSync(jobDir)) fs.mkdirSync(jobDir, { recursive: true });

        let fileName = "";
        let compileCmd = "";
        let runCmd = "";

        if (language === 'python') {
            fileName = "script.py";
            runCmd = `python3 "${path.join(jobDir, fileName)}"`;
        } else if (language === 'java') {
            fileName = "Solution.java";
            compileCmd = `javac "${path.join(jobDir, fileName)}"`;
            runCmd = `java -cp "${jobDir}" Solution`;
        } else if (language === 'c') {
            fileName = "main.c";
            const outPath = path.join(jobDir, "program.out");
            compileCmd = `gcc "${path.join(jobDir, fileName)}" -o "${outPath}"`;
            runCmd = `"${outPath}"`;
        }

        fs.writeFileSync(path.join(jobDir, fileName), script);

        // Compilation Phase
        if (compileCmd) {
            try {
                execSync(compileCmd, { stdio: 'pipe' });
            } catch (compileError) {
                if (isSubmit && userId) {
                    await Submission.create({
                        userId,
                        problemId,
                        code: script,
                        language,
                        status: "Runtime Error",
                        actualOutput: "Compilation failed",
                        submittedAt: new Date()
                    });
                }
                fs.rmSync(jobDir, { recursive: true, force: true });
                return res.json({ status: "Runtime Error", actualOutput: "Compilation failed" });
            }
        }

        // Execution Phase (Test Cases)
        let allPassed = true;
        let resultData = null;
        let lastOutput = "";
        let failedCaseInfo = null;

        for (let tc of problem.testCases) {
            const output = await new Promise((resolve) => {
                const child = exec(runCmd, { timeout: 5000 }, (err, stdout, stderr) => {
                    resolve({ stdout: stdout.trim(), stderr: stderr || (err ? err.message : "") });
                });
                child.stdin.write(tc.input + "\n");
                child.stdin.end();
            });

            lastOutput = output.stdout;

            if (output.stderr || output.stdout !== tc.expectedOutput.trim()) {
                resultData = { status: output.stderr ? "Runtime Error" : "Wrong Answer", actualOutput: output.stdout };
                failedCaseInfo = { input: tc.input, expected: tc.expectedOutput, actual: output.stdout };
                allPassed = false;
                break;
            }
        }

        if (allPassed) {
            resultData = { status: "Accepted", actualOutput: lastOutput };
        }

        // Save Submission to Database
        if (isSubmit && userId) {
            if (resultData.status === "Accepted") {
                const user = await User.findById(userId);
                if (user && !user.solvedProblems.includes(problemId)) {
                    await User.findByIdAndUpdate(userId, { 
                        $inc: { solvedCount: 1 },
                        $push: { solvedProblems: problemId }
                    });
                }
            }

            await Submission.create({
                userId, 
                problemId,
                code: script,
                language,
                status: resultData.status,
                actualOutput: resultData.actualOutput,
                failedCase: failedCaseInfo,
                submittedAt: new Date(),
                runtime: Math.floor(Math.random() * 50) + 10,
                memory: (Math.random() * (20 - 10) + 10).toFixed(1)
            });
        }

        // Cleanup
        fs.rmSync(jobDir, { recursive: true, force: true });
        res.json({ ...resultData, failedCase: failedCaseInfo });

    } catch (err) {
        if (fs.existsSync(jobDir)) fs.rmSync(jobDir, { recursive: true, force: true });
        res.status(500).json({ error: err.message });
    }
});

// Port Logic for Cloud Deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));