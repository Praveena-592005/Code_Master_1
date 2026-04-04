import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// IMPORT the helpers from your api file
import { fetchProblems, fetchUserSubmissions } from '../api'; 

const Dashboard = () => {
    const [problems, setProblems] = useState([]);
    const [filteredProblems, setFilteredProblems] = useState([]);
    const [solvedProblemIds, setSolvedProblemIds] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // FIXED: Use the helper instead of localhost:5000
                const resProbs = await fetchProblems();
                setProblems(resProbs.data);
                setFilteredProblems(resProbs.data);
                
                const userId = localStorage.getItem('userId');
                if (userId && userId !== 'null') {
                    try {
                        // FIXED: Use the helper instead of localhost:5000
                        const resSubs = await fetchUserSubmissions(userId);
                        const data = resSubs.data || [];
                        const uniqueAcceptedIds = new Set();
                        
                        data.forEach(sub => {
                            if (sub.status === 'Accepted') {
                                // Extract the ID safely
                                const id = sub.problemId?._id || sub.problemId;
                                if (id) uniqueAcceptedIds.add(String(id));
                            }
                        });
                        setSolvedProblemIds(uniqueAcceptedIds);
                    } catch (subErr) {
                        console.warn("Could not fetch user progress");
                    }
                }
            } catch (err) {
                console.error("Dashboard Load Error:", err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        let temp = [...problems];
        if (searchTerm) {
            temp = temp.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (difficultyFilter !== 'All') {
            temp = temp.filter(p => p.difficulty === difficultyFilter);
        }
        setFilteredProblems(temp);
    }, [searchTerm, difficultyFilter, problems]);

    const getDiffStyle = (d) => ({
        color: d === 'Easy' ? '#00b8a3' : d === 'Medium' ? '#ffc01e' : '#ff375f',
        fontWeight: '700',
        fontSize: '16px',
        padding: '6px 14px',
        borderRadius: '20px',
        backgroundColor: d === 'Easy' ? '#00b8a315' : d === 'Medium' ? '#ffc01e15' : '#ff375f15'
    });

    return (
        <div style={{ backgroundColor: '#f7f8fa', minHeight: '100vh', width: '100vw', overflowX: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>
            <div style={{ maxWidth: '1300px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ margin: 0, color: '#1a1a1a', fontSize: '42px', fontWeight: '800' }}>Problem Set</h1>
                        <p style={{ margin: '10px 0 0', color: '#555', fontSize: '20px' }}>Sharpen your skills with our curated coding challenges.</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', color: '#888', marginBottom: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>Your Progress</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ width: '250px', height: '14px', backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ 
                                    width: `${problems.length > 0 ? (solvedProblemIds.size / problems.length) * 100 : 0}%`, 
                                    height: '100%', 
                                    backgroundColor: '#2db55d', 
                                    borderRadius: '10px', 
                                    transition: 'width 1s ease' 
                                }}></div>
                            </div>
                            <span style={{ fontWeight: 'bold', color: '#1a1a1a', fontSize: '22px' }}>
                                {solvedProblemIds.size} <span style={{ color: '#aaa', fontWeight: 'normal' }}>/ {problems.length}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '35px', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input 
                            type="text"
                            placeholder="Search problems..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '18px 25px', borderRadius: '12px', border: '1px solid #ccc', fontSize: '18px', outline: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}
                        />
                    </div>
                    <select 
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        style={{ padding: '18px 25px', borderRadius: '12px', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer', outline: 'none', minWidth: '200px', fontSize: '18px', fontWeight: '500' }}
                    >
                        <option value="All">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #eee', color: '#666', textAlign: 'left', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                                <th style={{ padding: '25px', width: '100px', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '25px' }}>Title</th>
                                <th style={{ padding: '25px' }}>Acceptance</th>
                                <th style={{ padding: '25px' }}>Difficulty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProblems.length > 0 ? (
                                filteredProblems.map((p) => {
                                    const pId = String(p._id);
                                    const isSolved = solvedProblemIds.has(pId);
                                    return (
                                        <tr 
                                            key={pId} 
                                            onClick={() => navigate(`/problem/${pId}`)}
                                            style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer', transition: 'background 0.2s' }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <td style={{ padding: '22px', textAlign: 'center' }}>
                                                <div style={{ 
                                                    width: '14px', 
                                                    height: '14px', 
                                                    borderRadius: '50%', 
                                                    backgroundColor: isSolved ? '#2db55d' : 'transparent',
                                                    border: isSolved ? 'none' : '2px solid #ccc',
                                                    margin: '0 auto'
                                                 }}></div>
                                            </td>
                                            <td style={{ padding: '22px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                    <span style={{ color: '#888', fontSize: '18px', width: '35px', fontWeight: '500' }}>{p.problemId}.</span>
                                                    <span style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '20px' }}>{p.title}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '22px' }}>
                                                <span style={{ fontSize: '18px', color: '#444', fontWeight: '500' }}>{p.acceptance || '0%'}</span>
                                            </td>
                                            <td style={{ padding: '22px' }}>
                                                <span style={getDiffStyle(p.difficulty)}>{p.difficulty}</span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ padding: '100px', textAlign: 'center', color: '#999', fontSize: '20px' }}>No problems match your search criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;