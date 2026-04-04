// src/pages/ProblemPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

const fallbacks = {
    python: 'class Solution:\n    def solve(self):\n        import sys\n        input_data = sys.stdin.read().strip()\n        print(input_data)',
    c: '#include <stdio.h>\n\nint main() {\n    char input[1000];\n    if (scanf("%s", input) != EOF) {\n        printf("%s", input);\n    }\n    return 0;\n}',
    java: 'import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String s = sc.next();\n            System.out.print(s);\n        }\n    }\n}'
};

const erf = (x) => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
};

const ProblemPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    
    const [problem, setProblem] = useState(null);
    const [allProblems, setAllProblems] = useState([]);
    const [language, setLanguage] = useState("python");
    const [userCode, setUserCode] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [status, setStatus] = useState(""); 
    const [activeTab, setActiveTab] = useState("description");
    const [submissions, setSubmissions] = useState([]);
    const [lastResult, setLastResult] = useState(null);
    const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
    const [consoleTab, setConsoleTab] = useState("testcase");
    const [actualOutput, setActualOutput] = useState("");
    const [showResultTab, setShowResultTab] = useState(false);
    const [uniqueSolvedCount, setUniqueSolvedCount] = useState(0);

    const fetchHistory = async () => {
        if (!userId) return;
        try {
            const res = await axios.get(`http://localhost:5000/api/submissions/user/${userId}`);
            const history = res.data || [];
            
            const currentProblemSubmissions = history.filter(sub => {
                const subProbId = sub.problemId?._id || sub.problemId;
                return String(subProbId) === String(id);
            });
            setSubmissions(currentProblemSubmissions);

            const uniqueSolved = new Set();
            history.forEach(sub => {
                if (sub.status === 'Accepted') {
                    const subProbId = sub.problemId?._id || sub.problemId;
                    uniqueSolved.add(String(subProbId));
                }
            });
            setUniqueSolvedCount(uniqueSolved.size);
        } catch (err) {
            console.error("Failed to fetch history:", err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const [probRes, allProbsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/problems/${id}`),
                    axios.get(`http://localhost:5000/api/problems`)
                ]);
                if (probRes.data) {
                    setProblem(probRes.data);
                    setAllProblems(allProbsRes.data);
                    const lastLang = localStorage.getItem(`last_lang_${id}`) || "python";
                    setLanguage(lastLang);
                    const savedCode = localStorage.getItem(`code_${id}_${lastLang}`);
                    setUserCode(savedCode || probRes.data.templates?.[lastLang] || fallbacks[lastLang]);
                    fetchHistory();
                    setShowResultTab(false);
                }
            } catch (err) {
                setStatus("Problem Not Found");
            }
        };
        loadData();
    }, [id]);

    const performanceMetrics = useMemo(() => {
        if (!lastResult || lastResult.status !== "Accepted") return null;
        const actualTime = lastResult.runtime || 25;
        const actualMemory = lastResult.memory || "14.2";
        const mean = 40; 
        const stdDev = 15;
        const zScore = (actualTime - mean) / stdDev;
        const beatsTime = (1 - (0.5 * (1 + erf(zScore / Math.sqrt(2))))) * 100;
        const distribution = [];
        for (let i = 0; i <= 100; i += 5) {
            const x = (i - mean) / stdDev;
            const count = Math.floor(100 * (1 / (Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * x * x));
            distribution.push({ 
                ms: i, 
                count: count + Math.floor(Math.random() * 5), 
                isUser: Math.abs(i - actualTime) <= 2.5 
            });
        }
        return { time: actualTime, memory: actualMemory, beatsTime: beatsTime.toFixed(2), beatsMemory: 85.4, distribution };
    }, [lastResult]);

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        localStorage.setItem(`last_lang_${id}`, newLang);
        const savedCode = localStorage.getItem(`code_${id}_${newLang}`);
        setUserCode(savedCode || problem.templates?.[newLang] || fallbacks[newLang]);
    };

    const handleAction = async (isSubmit) => {
        if (!userId) {
            alert("Please login to submit code");
            return;
        }
        setIsRunning(true);
        setStatus("");
        setActualOutput("");
        setConsoleTab("result");
        try {
            const res = await axios.post('http://localhost:5000/api/execute', { 
                script: userCode, 
                language: language,
                problemId: id,
                isSubmit: isSubmit,
                userId: userId
            });
            const finalStatus = res.data.status;
            const output = String(res.data.actualOutput || "").trim();
            setStatus(finalStatus);
            setActualOutput(output);
            const resultObj = { 
                status: finalStatus, 
                actualOutput: output,
                failedCase: res.data.failedCase,
                runtime: res.data.runtime || 25, 
                memory: res.data.memory || "14.2",
                code: userCode,
                language: language,
                submittedAt: new Date()
            };
            setLastResult(resultObj);
            setShowResultTab(true);

            if (finalStatus === "Accepted") {
                setActiveTab("accepted");
            } else {
                setActiveTab("wrong");
            }

            if (isSubmit) {
                await fetchHistory();
            }
        } catch (err) {
            setStatus("Runtime Error");
            setActiveTab("wrong");
        } finally {
            setIsRunning(false);
        }
    };

    const navigateProblem = (direction) => {
        const currentIndex = allProblems.findIndex(p => String(p._id) === String(id));
        if (direction === 'next' && currentIndex < allProblems.length - 1) {
            navigate(`/problem/${allProblems[currentIndex + 1]._id}`);
        } else if (direction === 'prev' && currentIndex > 0) {
            navigate(`/problem/${allProblems[currentIndex - 1]._id}`);
        }
    };

    const viewSubmission = (sub) => {
        setLanguage(sub.language || "python");
        setUserCode(sub.code);
        setStatus(sub.status);
        setActualOutput(sub.actualOutput || "");
        setLastResult(sub);
        setShowResultTab(true);
        if (sub.status === "Accepted") setActiveTab("accepted");
        else setActiveTab("wrong");
    };

    const getDifficultyStyle = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return { color: '#2db55d' };
            case 'medium': return { color: '#ffa116' };
            case 'hard': return { color: '#ef4743' };
            default: return { color: '#eff1f6' };
        }
    };

    if (!problem) return (
        <div style={{ background: '#0a0a0a', height: '100vh', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '500' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #333', borderTopColor: '#ffa116', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }} />
                Loading Problem...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', backgroundColor: '#0f0f0f', color: '#eff1f6', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: '54px', background: '#1a1a1a', borderBottom: '1px solid #2d2d2d', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#eff1f6', fontSize: '14px', cursor: 'pointer' }} onClick={() => navigate('/problems')}>
                           <span style={{ fontSize: '18px', color: '#999' }}>☰</span> Problem List
                        </div>
                        <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
                            <button 
                                onClick={() => navigateProblem('prev')}
                                style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', fontSize: '18px', padding: '4px', display: 'flex', alignItems: 'center' }}
                            >
                                ‹
                            </button>
                            <button 
                                onClick={() => navigateProblem('next')}
                                style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer', fontSize: '18px', padding: '4px', display: 'flex', alignItems: 'center' }}
                            >
                                ›
                            </button>
                        </div>
                    </div>

                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <select value={language} onChange={handleLanguageChange} style={{ padding: '6px 12px', borderRadius: '6px', background: '#262626', color: '#ddd', border: '1px solid #333', fontSize: '13px', outline: 'none', cursor: 'pointer' }}>
                        <option value="python">Python 3</option>
                        <option value="java">Java 17</option>
                        <option value="c">C (GCC 11)</option>
                    </select>
                    <div style={{ height: '20px', width: '1px', background: '#333' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleAction(false)} disabled={isRunning} style={{ padding: '7px 20px', borderRadius: '6px', border: 'none', background: '#2d2d2d', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'background 0.2s' }}>
                            {isRunning ? 'Running...' : 'Run'}
                        </button>
                        <button onClick={() => handleAction(true)} disabled={isRunning} style={{ padding: '7px 20px', borderRadius: '6px', border: 'none', background: '#2db55d', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'opacity 0.2s' }}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', padding: '8px', gap: '8px' }}>
                <div style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: '8px', display: 'flex', flexDirection: 'column', border: '1px solid #2d2d2d', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', background: '#222', padding: '0 8px', borderBottom: '1px solid #2d2d2d' }}>
                        {['description', 'submissions'].map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '14px 16px', border: 'none', borderBottom: activeTab === tab ? '2px solid #ffa116' : '2px solid transparent', background: 'transparent', fontWeight: '500', cursor: 'pointer', color: activeTab === tab ? '#fff' : '#999', fontSize: '13px', textTransform: 'capitalize', transition: 'color 0.2s' }}>
                                {tab}
                            </button>
                        ))}
                        {showResultTab && lastResult?.status === "Accepted" && (
                            <button onClick={() => setActiveTab("accepted")} style={{ padding: '14px 16px', border: 'none', borderBottom: activeTab === 'accepted' ? '2px solid #2db55d' : '2px solid transparent', background: 'transparent', fontWeight: '500', cursor: 'pointer', color: '#2db55d', fontSize: '13px' }}>✅ Solved</button>
                        )}
                        {showResultTab && lastResult && lastResult.status !== "Accepted" && (
                            <button onClick={() => setActiveTab("wrong")} style={{ padding: '14px 16px', border: 'none', borderBottom: activeTab === 'wrong' ? '2px solid #ef4743' : '2px solid transparent', background: 'transparent', fontWeight: '500', cursor: 'pointer', color: '#ef4743', fontSize: '13px' }}>❌ {lastResult.status}</button>
                        )}
                    </div>
                    <div style={{ padding: '24px', overflowY: 'auto', flex: 1, color: '#eff1f6' }}>
                        {activeTab === "description" && (
                            <div style={{ maxWidth: '800px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '600' }}>{problem.problemId}. {problem.title}</h1>
                                    <span style={{ fontSize: '14px', fontWeight: '500', ...getDifficultyStyle(problem.difficulty) }}>{problem.difficulty}</span>
                                </div>
                                <div style={{ height: '1px', background: '#2d2d2d', marginBottom: '24px' }} />
                                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: '#bdc1c6', fontSize: '15px' }}>{problem.description}</p>
                                {problem.testCases?.slice(0, 3).map((ex, i) => (
                                    <div key={i} style={{ marginTop: '32px' }}>
                                        <div style={{ fontWeight: '600', marginBottom: '12px', fontSize: '14px' }}>Example {i + 1}:</div>
                                        <div style={{ background: '#262626', padding: '16px', borderRadius: '8px', border: '1px solid #333', fontFamily: '"Fira Code", monospace', fontSize: '13px', lineHeight: '1.6' }}>
                                            <div style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                                                <span style={{ color: '#999' }}>Input:</span> 
                                                <span style={{ color: '#eff1f6', whiteSpace: 'pre-wrap' }}>{ex.input}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <span style={{ color: '#999' }}>Output:</span> 
                                                <span style={{ color: '#eff1f6', whiteSpace: 'pre-wrap' }}>{ex.expectedOutput}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {problem.constraints && problem.constraints.length > 0 && (
                                    <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                                        <div style={{ fontWeight: '600', marginBottom: '16px', fontSize: '14px' }}>Constraints:</div>
                                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#bdc1c6', fontSize: '14px', lineHeight: '2' }}>
                                            {problem.constraints.map((constraint, index) => (
                                                <li key={index}>
                                                    <code style={{ background: '#262626', padding: '2px 6px', borderRadius: '4px', fontFamily: '"Fira Code", monospace', fontSize: '13px' }}>{constraint}</code>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "accepted" && showResultTab && performanceMetrics && (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <h2 style={{ color: '#2db55d', fontSize: '20px', marginBottom: '24px' }}>Submission Accepted</h2>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                                    <div style={{ flex: 1, padding: '20px', background: '#262626', borderRadius: '12px', border: '1px solid #333' }}>
                                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Runtime</div>
                                        <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>{performanceMetrics.time} <span style={{ fontSize: '14px', fontWeight: '400', color: '#666' }}>ms</span></div>
                                        <div style={{ fontSize: '13px', color: '#2db55d', marginTop: '8px', fontWeight: '500' }}>Beats {performanceMetrics.beatsTime}%</div>
                                    </div>
                                    <div style={{ flex: 1, padding: '20px', background: '#262626', borderRadius: '12px', border: '1px solid #333' }}>
                                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Memory</div>
                                        <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>{performanceMetrics.memory} <span style={{ fontSize: '14px', fontWeight: '400', color: '#666' }}>MB</span></div>
                                        <div style={{ fontSize: '13px', color: '#2db55d', marginTop: '8px', fontWeight: '500' }}>Beats {performanceMetrics.beatsMemory}%</div>
                                    </div>
                                </div>
                                <h4 style={{ color: '#999', marginBottom: '16px', fontSize: '14px', fontWeight: '500' }}>Runtime Distribution</h4>
                                <div style={{ width: '100%', height: '240px', minHeight: '240px', background: '#1a1a1a', borderRadius: '8px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={performanceMetrics.distribution}>
                                            <XAxis dataKey="ms" hide />
                                            <Tooltip cursor={{ fill: '#333', opacity: 0.4 }} content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div style={{ background: '#222', padding: '8px 12px', border: '1px solid #444', borderRadius: '4px', fontSize: '12px', color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                                                            {`${payload[0].value} users at ${payload[0].payload.ms}ms`}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }} />
                                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                                {performanceMetrics.distribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.isUser ? '#ffa116' : '#333'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                        {activeTab === "wrong" && showResultTab && (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <h2 style={{ color: '#ef4743', fontSize: '20px', marginBottom: '20px' }}>{lastResult?.status}</h2>
                                <div style={{ background: '#2c1515', padding: '24px', borderRadius: '12px', border: '1px solid #4d1d1d' }}>
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ fontSize: '12px', color: '#ef4743', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Input</div>
                                        <code style={{ background: '#1a1a1a', padding: '12px', display: 'block', borderRadius: '6px', border: '1px solid #3d1a1a', color: '#eff1f6', whiteSpace: 'pre-wrap' }}>{lastResult?.failedCase?.input || (problem.testCases && problem.testCases[0]?.input)}</code>
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <div style={{ fontSize: '12px', color: '#ef4743', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Your Output</div>
                                        <code style={{ background: '#1a1a1a', padding: '12px', display: 'block', borderRadius: '6px', border: '1px solid #3d1a1a', color: '#ef4743', whiteSpace: 'pre-wrap' }}>{actualOutput || "No output"}</code>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#2db55d', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Expected Output</div>
                                        <code style={{ background: '#1a1a1a', padding: '12px', display: 'block', borderRadius: '6px', border: '1px solid #1a3d24', color: '#2db55d', whiteSpace: 'pre-wrap' }}>{lastResult?.failedCase?.expected || (problem.testCases && problem.testCases[0]?.expectedOutput)}</code>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "submissions" && (
                            <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Submission History</h3>
                                {submissions.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {submissions.map((s, i) => (
                                            <div key={i} onClick={() => viewSubmission(s)} style={{ padding: '16px', background: '#262626', borderRadius: '8px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                                                <div>
                                                    <div style={{ color: s.status === "Accepted" ? "#2db55d" : "#ef4743", fontWeight: '700', fontSize: '14px' }}>{s.status}</div>
                                                    <div style={{ fontSize: '12px', color: '#777', marginTop: '4px' }}>{(s.language || 'Code').toUpperCase()} • {new Date(s.submittedAt).toLocaleDateString()}</div>
                                                </div>
                                                <div style={{ color: '#555', fontSize: '18px' }}>›</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
                                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>📋</div>
                                        <p>No submissions recorded for this problem yet.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ flex: 1, backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #2d2d2d', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '8px 16px', background: '#222', borderBottom: '1px solid #2d2d2d', color: '#999', fontSize: '12px', fontWeight: '600' }}>
                            CODE EDITOR
                        </div>
                        <textarea 
                            value={userCode} 
                            onChange={(e) => {
                                setUserCode(e.target.value);
                                localStorage.setItem(`code_${id}_${language}`, e.target.value);
                            }}
                            spellCheck="false"
                            style={{ flex: 1, backgroundColor: '#1a1a1a', color: '#d4d4d4', fontFamily: '"Fira Code", "Source Code Pro", monospace', fontSize: '14px', padding: '16px', border: 'none', outline: 'none', resize: 'none', lineHeight: '1.6' }}
                        />
                    </div>
                    <div style={{ height: '35%', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #2d2d2d', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', background: '#222', borderBottom: '1px solid #2d2d2d' }}>
                            <button onClick={() => setConsoleTab("testcase")} style={{ padding: '12px 20px', background: 'transparent', border: 'none', color: consoleTab === 'testcase' ? '#fff' : '#777', borderBottom: consoleTab === 'testcase' ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>Testcase</button>
                            <button onClick={() => setConsoleTab("result")} style={{ padding: '12px 20px', background: 'transparent', border: 'none', color: consoleTab === 'result' ? '#fff' : '#777', borderBottom: consoleTab === 'result' ? '2px solid #fff' : '2px solid transparent', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>Test Result</button>
                        </div>
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                            {consoleTab === "testcase" ? (
                                <div>
                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                        {problem.testCases?.map((_, idx) => (
                                            <button key={idx} onClick={() => setSelectedCaseIdx(idx)} style={{ padding: '6px 12px', background: selectedCaseIdx === idx ? '#333' : '#262626', color: selectedCaseIdx === idx ? '#fff' : '#888', border: '1px solid #3d3d3d', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Case {idx + 1}</button>
                                        ))}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Input</div>
                                    <pre style={{ background: '#262626', padding: '12px', borderRadius: '6px', border: '1px solid #333', fontSize: '13px', color: '#eff1f6', margin: 0, fontFamily: '"Fira Code", monospace', whiteSpace: 'pre-wrap' }}>{problem.testCases[selectedCaseIdx]?.input}</pre>
                                </div>
                            ) : (
                                <div style={{ animation: 'fadeIn 0.2s ease' }}>
                                    <div style={{ color: status === "Accepted" ? "#2db55d" : status ? "#ef4743" : "#555", fontWeight: '700', fontSize: '16px', marginBottom: '16px' }}>{status || "Run your code to see results"}</div>
                                    {status && (
                                        <>
                                            <div style={{ marginBottom: '12px' }}>
                                                <div style={{ fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Input</div>
                                                <pre style={{ background: '#262626', padding: '10px', borderRadius: '6px', border: '1px solid #333', fontSize: '12px', color: '#eff1f6', margin: 0, whiteSpace: 'pre-wrap' }}>{problem.testCases[selectedCaseIdx]?.input}</pre>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#666', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>Output</div>
                                                <pre style={{ background: '#262626', padding: '10px', borderRadius: '6px', border: '1px solid #333', fontSize: '12px', color: status === "Accepted" ? "#2db55d" : "#ef4743", margin: 0, whiteSpace: 'pre-wrap' }}>
                                                    {actualOutput || "No output"}
                                                </pre>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                ::-webkit-scrollbar { width: 6px; height: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: #444; }
            `}</style>
        </div>
    );
};

export default ProblemPage;