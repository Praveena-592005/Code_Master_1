import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CertificateModal from '../components/CertificateModal';
import MilestoneCertificateModal from '../components/MilestoneCertificateModal';

const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://your-backend-name.onrender.com';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [solvedCount, setSolvedCount] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '' });
    const userId = localStorage.getItem('userId');
    const [isCourseCertOpen, setIsCourseCertOpen] = useState(false);
    const [selectedCourseCert, setSelectedCourseCert] = useState({ name: '', id: '' });
    const [isMilestoneCertOpen, setIsMilestoneCertOpen] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState({ name: '', id: '', image: '' });

    const badgeImages = {
        bronze: "/bronze.png",
        silver: "/silver.png",
        gold: "/gold.png",
        python: "/python.png",
        java: "/java.png",
        c: "/c.png"
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const profileRes = await axios.get(`${API_BASE_URL}/api/user/profile/${userId}`);
                setUser(profileRes.data);
                setEditData({ name: profileRes.data.name, email: profileRes.data.email });
                
                const submissionsRes = await axios.get(`${API_BASE_URL}/api/submissions/user/${userId}`);
                const accepted = submissionsRes.data.filter(s => s.status === 'Accepted');
                const uniqueSolved = [...new Set(accepted.map(s => s.problemId))];
                setSolvedCount(uniqueSolved.length);
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        if (userId) fetchUserData();
    }, [userId]);

    const handleSave = async () => {
        try {
            await axios.put(`${API_BASE_URL}/api/user/update/${userId}`, editData);
            setUser({ ...user, name: editData.name, email: editData.email });
            localStorage.setItem('userName', editData.name);
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (err) {
            alert("Failed to update profile");
        }
    };

    const openCourseCert = (title) => {
        setSelectedCourseCert({
            name: title,
            id: `CM-CR-${Math.floor(1000 + Math.random() * 9000)}`
        });
        setIsCourseCertOpen(true);
    };

    const openMilestoneCert = (label, image) => {
        setSelectedMilestone({
            name: label,
            id: `CM-PR-${Math.floor(1000 + Math.random() * 9000)}`,
            image: image
        });
        setIsMilestoneCertOpen(true);
    };

    if (!user) return <div style={{ padding: '50px', color: 'white', background: '#1a1a1a', height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>Loading...</div>;

    const milestones = [
        { key: 'bronze', label: 'BRONZE', count: 10, color: '#cd7f32' },
        { key: 'silver', label: 'SILVER', count: 25, color: '#C0C0C0' },
        { key: 'gold', label: 'GOLD', count: 50, color: '#ffa116' }
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', width: '100vw', boxSizing: 'border-box', overflowX: 'hidden', paddingBottom: '50px', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', width: '100%', boxSizing: 'border-box' }}>
                
                {/* Profile Header */}
                <div style={{ background: '#262626', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', textAlign: 'center', marginBottom: '30px', position: 'relative', border: '1px solid #333' }}>
                    <button onClick={() => setIsEditing(!isEditing)} style={{ position: 'absolute', top: '25px', right: '25px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#ffa116' }} title="Edit Profile">✏️</button>
                    <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: 'linear-gradient(135deg, #ffa116 0%, #ff8008 100%)', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', margin: '0 auto 20px', fontWeight: '900', boxShadow: '0 0 20px rgba(255, 161, 22, 0.3)' }}>{user.name.charAt(0).toUpperCase()}</div>
                    
                    {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '350px', margin: '0 auto' }}>
                            <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#333', color: '#fff', textAlign: 'center', outline: 'none' }} />
                            <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#333', color: '#fff', textAlign: 'center', outline: 'none' }} />
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                                <button onClick={handleSave} style={{ background: '#ffa116', color: '#1a1a1a', border: 'none', padding: '10px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
                                <button onClick={() => setIsEditing(false)} style={{ background: '#444', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 style={{ margin: '0', fontSize: '38px', color: '#fff', fontWeight: '800' }}>{user.name}</h2>
                            <p style={{ color: '#aaa', fontSize: '18px', marginTop: '8px' }}>{user.email}</p>
                        </>
                    )}
                </div>

                {/* Badges Section */}
                <div style={{ background: '#262626', padding: '30px', borderRadius: '20px', marginBottom: '30px', border: '1px solid #333' }}>
                    <h3 style={{ marginBottom: '35px', color: '#fff', fontSize: '22px', borderLeft: '5px solid #ffa116', paddingLeft: '15px' }}>Achieved Badges</h3>
                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {milestones.map((m) => {
                            const isAchieved = solvedCount >= m.count;
                            return (
                                <div key={m.key} style={{ textAlign: 'center', width: '180px' }}>
                                    <div 
                                        onClick={() => isAchieved && openMilestoneCert(m.label, badgeImages[m.key])}
                                        style={{ 
                                            position: 'relative', 
                                            cursor: isAchieved ? 'pointer' : 'default',
                                            display: 'inline-block',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => isAchieved && (e.currentTarget.style.transform = 'translateY(-10px)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                                    >
                                        <img 
                                            src={badgeImages[m.key]} 
                                            alt={`${m.label} Badge`} 
                                            style={{ 
                                                width: '130px', 
                                                height: '130px', 
                                                objectFit: 'contain', 
                                                filter: isAchieved ? 'drop-shadow(0 0 12px rgba(255,161,22,0.4))' : 'grayscale(100%) brightness(0.6) opacity(0.4)', 
                                                transition: 'all 0.4s ease'
                                            }} 
                                        />
                                    </div>
                                    <div style={{ fontWeight: '800', fontSize: '16px', color: isAchieved ? m.color : '#555', marginTop: '15px', letterSpacing: '1px' }}>{m.label}</div>
                                    <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{m.count} Problems Solved</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Stats Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
                    <div style={{ background: '#262626', padding: '40px', borderRadius: '20px', textAlign: 'center', border: '1px solid #333', borderBottom: '5px solid #ffa116' }}>
                        <h1 style={{ color: '#ffa116', margin: '0', fontSize: '60px', fontWeight: '900' }}>{solvedCount} / 50</h1>
                        <p style={{ color: '#aaa', fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', marginTop: '10px' }}>Solved Problems</p>
                    </div>
                    <div style={{ background: '#262626', padding: '40px', borderRadius: '20px', textAlign: 'center', border: '1px solid #333', borderBottom: '5px solid #007bff' }}>
                        <h1 style={{ color: '#007bff', margin: '0', fontSize: '60px', fontWeight: '900' }}>{user.completedLessons?.length || 0} / 3</h1>
                        <p style={{ color: '#aaa', fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', marginTop: '10px' }}>Courses Finished</p>
                    </div>
                </div>

                {/* Skills/Courses Section */}
                <div style={{ background: '#262626', padding: '30px', borderRadius: '20px', marginBottom: '30px', border: '1px solid #333' }}>
                    <h3 style={{ marginBottom: '25px', color: '#fff', fontSize: '22px', borderLeft: '5px solid #007bff', paddingLeft: '15px' }}>Verified Skills</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                        {['Python', 'Java', 'C'].map(course => {
                            const courseKey = course.toLowerCase();
                            const isFinished = user.completedLessons?.includes(courseKey);
                            return (
                                <div key={course} style={{ padding: '30px', borderRadius: '20px', border: '1px solid #333', background: isFinished ? '#2d2d2d' : '#222', textAlign: 'center', transition: 'all 0.3s ease' }}>
                                    <div style={{ width: '120px', height: '120px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img 
                                            src={badgeImages[courseKey]} 
                                            alt={`${course} Skill Badge`} 
                                            style={{ width: '110px', height: '110px', objectFit: 'contain', filter: isFinished ? 'drop-shadow(0 0 10px rgba(0,123,255,0.3))' : 'grayscale(100%) brightness(0.6) opacity(0.4)' }}
                                        />
                                    </div>
                                    <h4 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '20px', fontWeight: '700' }}>{course} Mastery</h4>
                                    {isFinished ? (
                                        <button 
                                            onClick={() => openCourseCert(`${course} Masterclass`)} 
                                            style={{ background: '#007bff', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: 'transform 0.2s' }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        >
                                            View Certificate
                                        </button>
                                    ) : (
                                        <div style={{ fontSize: '12px', color: '#555', border: '1px solid #444', padding: '10px', borderRadius: '8px', fontWeight: 'bold', letterSpacing: '1px' }}>LOCKED</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <CertificateModal 
                isOpen={isCourseCertOpen} 
                onClose={() => setIsCourseCertOpen(false)} 
                userName={user.name} 
                courseName={selectedCourseCert.name} 
                certId={selectedCourseCert.id} 
            />
            <MilestoneCertificateModal 
                isOpen={isMilestoneCertOpen} 
                onClose={() => setIsMilestoneCertOpen(false)} 
                userName={user.name} 
                milestoneName={selectedMilestone.name} 
                certId={selectedMilestone.id} 
                badgeImg={selectedMilestone.image}
            />
        </div>
    );
};

export default Profile;