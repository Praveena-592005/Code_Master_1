import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
const navigate = useNavigate();
const userName = localStorage.getItem('userName');

const handleLogout = () => {
localStorage.clear();
navigate('/login');
};

return (
<nav style={{ 
display: 'flex', 
justifyContent: 'space-between', 
alignItems: 'center', 
padding: '15px 50px', 
backgroundColor: '#1a1a1a', 
color: 'white', 
width: '100vw', 
boxSizing: 'border-box' 
}}>
<div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
<div 
style={{ fontSize: '34px', fontWeight: 'bold', color: '#ffa116', cursor: 'pointer' }} 
onClick={() => navigate('/')}
>
CodeMaster
</div>
<div style={{ display: 'flex', gap: '20px' }}>
<Link to="/" style={{ color: '#ccc', textDecoration: 'none', fontSize: '20px' }}>Learning</Link>
<Link to="/problems" style={{ color: '#ccc', textDecoration: 'none', fontSize: '20px' }}>Problems</Link>
<Link to="/profile" style={{ color: '#ccc', textDecoration: 'none', fontSize: '20px' }}>Profile</Link>
</div>
</div>

<div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
<span style={{ color: '#888', fontWeight: '500', fontSize:"20px"}}>{userName || 'User'}</span>
<button 
onClick={handleLogout} 
style={{ background: '#333', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize:"20px" }}
>
Logout
</button>
</div>
</nav>
);
};

export default Navbar;