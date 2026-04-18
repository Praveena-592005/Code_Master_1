import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://code-master-backend-528u.onrender.com';

const ProblemList = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    
    const [problems, setProblems] = useState([]);
    const [solvedProblemIds, setSolvedProblemIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("All Difficulties");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [probsRes, submissionsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/problems`),
                    userId ? axios.get(`${API_BASE_URL}/api/submissions/user/${userId}`) : Promise.resolve({ data: [] })
                ]);

                const acceptedIds = new Set();
                if (submissionsRes.data) {
                    submissionsRes.data.forEach(sub => {
                        if (sub.status === 'Accepted') {
                            const pId = sub.problemId?._id || sub.problemId;
                            if (pId) acceptedIds.add(String(pId));
                        }
                    });
                }
                setProblems(probsRes.data);
                setSolvedProblemIds(acceptedIds);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const filteredProblems = problems.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = difficultyFilter === "All Difficulties" || p.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
    });

    if (loading) return (
        <div style={{ background: '#1a1a1a', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '60px', height: '60px', border: '5px solid #333', borderTop: '5px solid #ffa116', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '36px', margin: '0 0 12px 0', color: '#fff', fontWeight: '800' }}>Problem Set</h1>
                        <p style={{ color: '#aaa', margin: 0, fontSize: '18px' }}>Sharpen your skills with our curated coding challenges.</p>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '250px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#8c8c8c', marginBottom: '8px', textTransform: 'uppercase' }}>Your Progress</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ flex: 1, height: '10px', background: '#333', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{ width: `${problems.length > 0 ? (solvedProblemIds.size / problems.length) * 100 : 0}%`, height: '100%', background: '#2db55d', transition: 'width 0.3s ease' }}></div>
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                                <span style={{ color: '#2db55d' }}>{solvedProblemIds.size}</span> / {problems.length}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                    <input 
                        type="text" 
                        placeholder="Search questions" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, padding: '15px 20px', borderRadius: '10px', border: '1px solid #333', background: '#262626', color: '#fff', outline: 'none', fontSize: '16px' }}
                    />
                    <select 
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        style={{ padding: '15px', borderRadius: '10px', border: '1px solid #333', background: '#262626', color: '#fff', outline: 'none', fontSize: '16px', cursor: 'pointer', fontWeight: '500' }}
                    >
                        <option>All Difficulties</option>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                </div>

                <div style={{ background: '#262626', borderRadius: '15px', border: '1px solid #333', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #333', color: '#8c8c8c', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <th style={{ padding: '20px 25px', fontWeight: '600', width: '80px', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '20px 25px', fontWeight: '600' }}>Title</th>
                                <th style={{ padding: '20px 25px', fontWeight: '600' }}>Acceptance</th>
                                <th style={{ padding: '20px 25px', fontWeight: '600' }}>Difficulty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProblems.map((p) => {
                                const isSolved = solvedProblemIds.has(String(p._id));
                                return (
                                    <tr 
                                        key={p._id} 
                                        onClick={() => navigate(`/problem/${p._id}`)}
                                        style={{ borderBottom: '1px solid #333', cursor: 'pointer', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={{ padding: '20px 25px', textAlign: 'center' }}>
                                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: isSolved ? '#2db55d' : 'transparent', border: isSolved ? 'none' : '2px solid #555', margin: '0 auto' }}></div>
                                        </td>
                                        <td style={{ padding: '20px 25px', fontSize: '18px', color: '#fff' }}>
                                            <span style={{ color: '#666', marginRight: '12px', fontWeight: '500' }}>{p.problemId}.</span>
                                            <span style={{ fontWeight: '600' }}>{p.title}</span>
                                        </td>
                                        <td style={{ padding: '20px 25px', fontSize: '16px', color: '#aaa', fontWeight: '500' }}>{p.acceptance || '50%'}</td>
                                        <td style={{ padding: '20px 25px' }}>
                                            <span style={{ 
                                                fontSize: '15px', 
                                                fontWeight: '600',
                                                color: p.difficulty === 'Easy' ? '#2db55d' : p.difficulty === 'Medium' ? '#ffa116' : '#ef4743'
                                            }}>
                                                {p.difficulty}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProblemList;