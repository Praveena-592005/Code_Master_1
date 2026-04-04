// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api'; // Correctly importing the API helper

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Using the loginUser helper which points to your Render backend
            const res = await loginUser({ email, password });
            
            localStorage.setItem('userId', res.data.userId);
            localStorage.setItem('userName', res.data.name);
            localStorage.setItem('userEmail', res.data.email);
            
            // Redirect to home/dashboard after successful login
            navigate('/');
        } catch (err) {
            console.error("Login Error:", err);
            alert("Invalid credentials. Please check your email and password.");
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            width: '100vw', 
            backgroundColor: '#1a1a1a', 
            fontFamily: "'Inter', sans-serif",
            position: 'fixed',
            top: 0,
            left: 0
        }}>
            <form onSubmit={handleLogin} style={{ 
                backgroundColor: '#262626', 
                padding: '40px', 
                borderRadius: '16px', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)', 
                width: '100%',
                maxWidth: '400px',
                boxSizing: 'border-box',
                border: '1px solid #333'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: '#ffa116', margin: '0 0 10px 0', fontSize: '28px', fontWeight: 'bold' }}>CodeMaster</h1>
                    <h2 style={{ color: '#fff', fontSize: '20px', margin: 0 }}>Login</h2>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Email Address</label>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#333', color: '#fff', boxSizing: 'border-box', outline: 'none' }} 
                    />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#aaa' }}>Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#333', color: '#fff', boxSizing: 'border-box', outline: 'none' }} 
                    />
                </div>

                <button 
                    type="submit" 
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{ 
                        width: '100%', 
                        padding: '14px', 
                        backgroundColor: isHovered ? '#ffb84d' : '#ffa116', 
                        color: '#1a1a1a', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontWeight: 'bold', 
                        fontSize: '16px', 
                        transition: 'all 0.3s' 
                    }}
                >
                    Sign In
                </button>

                <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#aaa' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#ffa116', textDecoration: 'none', fontWeight: '600' }}>Register Now</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;