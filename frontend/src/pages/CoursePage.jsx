import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CertificateModal from '../components/CertificateModal';

const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://code-master-backend-528u.onrender.com';

const CoursePage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || "Student";
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const courseData = {
        python: {
            title: "Python Masterclass",
            video: "https://www.youtube.com/embed/rfscVS0vtbw",
            description: "Master Python from basics to advanced data structures. This course covers everything from syntax to object-oriented programming.",
            topics: ["Environment Setup", "Data Types", "Control Flow", "Functions & Modules", "File Handling", "OOP Concepts"]
        },
        java: {
            title: "Java Development",
            video: "https://www.youtube.com/embed/A74TOX803D0",
            description: "Learn Object-Oriented Programming using Java. Understand the JVM, memory management, and robust application building.",
            topics: ["JVM Architecture", "Classes & Objects", "Inheritance", "Exception Handling", "Collections Framework", "Multithreading"]
        },
        c: {
            title: "C Programming",
            video: "https://www.youtube.com/embed/irqbmMNs2Bo",
            description: "Understand low-level memory management and pointers. The foundation for all modern programming languages.",
            topics: ["Pointers", "Memory Allocation", "Structures", "File Handling", "Preprocessors", "Data Structures in C"]
        }
    };

    const currentCourse = courseData[courseId] || courseData.python;

    useEffect(() => {
        const checkProgress = async () => {
            if (!userId || userId === 'null') {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get(`${API_BASE_URL}/api/user/profile/${userId}`);
                if (res.data.completedLessons && res.data.completedLessons.includes(courseId)) {
                    setCompleted(true);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error checking progress", err);
                setLoading(false);
            }
        };
        checkProgress();
    }, [userId, courseId]);

    const handleComplete = async () => {
        if (!userId || userId === 'null') {
            alert("Please login to save your progress.");
            return;
        }
        try {
            const res = await axios.post(`${API_BASE_URL}/api/problems/complete-lesson`, { 
                userId, 
                lessonId: courseId 
            });
            if (res.status === 200 || res.status === 201) {
                setCompleted(true);
                setShowModal(true);
            }
        } catch (err) {
            console.error("Error saving progress", err);
            alert("Failed to save progress. Ensure your server is running.");
        }
    };

    if (loading) return <div style={{ background: '#121212', height: '100vh', color: 'white', padding: '50px' }}>Loading...</div>;

    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', width: '100vw', overflowX: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'row', padding: '40px', gap: '40px', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ flex: '1.5', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', background: '#000' }}>
                        <iframe 
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                            src={currentCourse.video} 
                            title="Course Video" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div style={{ marginTop: '30px' }}>
                        <h1 style={{ color: '#ffa116', fontSize: '42px', margin: '0 0 15px 0' }}>{currentCourse.title}</h1>
                        <p style={{ fontSize: '20px', color: '#ccc', lineHeight: '1.8', maxWidth: '900px' }}>{currentCourse.description}</p>
                        <button 
                            onClick={() => navigate(`/quiz/${courseId}`)}
                            style={{ 
                                marginTop: '20px', 
                                padding: '15px 30px', 
                                background: '#ffa116', 
                                color: 'black', 
                                border: 'none', 
                                borderRadius: '8px', 
                                fontWeight: 'bold', 
                                cursor: 'pointer', 
                                fontSize: '18px',
                                display: 'block' 
                            }}>
                            📝 Take Course Quiz
                        </button>
                    </div>
                </div>
                <div style={{ flex: '0.6', background: '#1e1e1e', padding: '30px', borderRadius: '16px', border: '1px solid #333', height: 'fit-content', position: 'sticky', top: '20px' }}>
                    <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '15px', color: '#ffa116', marginTop: 0 }}>Course Syllabus</h2>
                    <div style={{ marginTop: '20px' }}>
                        {currentCourse.topics.map((topic, index) => (
                            <div key={index} style={{ padding: '18px', marginBottom: '12px', background: '#2a2a2a', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #383838' }}>
                                <span style={{ color: '#ffa116', fontWeight: 'bold', fontSize: '18px' }}>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span> 
                                <span style={{ fontSize: '17px', fontWeight: '500' }}>{topic}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '40px' }}>
                        <button 
                            onClick={handleComplete}
                            disabled={completed}
                            style={{ 
                                width: '100%', 
                                padding: '20px', 
                                borderRadius: '12px', 
                                border: 'none', 
                                background: completed ? '#333' : 'linear-gradient(135deg, #2db55d 0%, #1a9c4b 100%)', 
                                color: 'white', 
                                fontWeight: '800', 
                                fontSize: '18px', 
                                cursor: completed ? 'not-allowed' : 'pointer',
                                boxShadow: completed ? 'none' : '0 10px 20px rgba(45, 181, 93, 0.3)',
                                transition: 'all 0.3s ease'
                            }}>
                            {completed ? "Course Completed ✅" : "Mark as Completed"}
                        </button>
                    </div>
                </div>
            </div>
            <CertificateModal 
                isOpen={showModal} 
                onClose={() => setShowModal(false)} 
                userName={userName} 
                courseName={currentCourse.title} 
                certId={`CM-${courseId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`}
            />
        </div>
    );
};
export default CoursePage;