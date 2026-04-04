import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
const navigate = useNavigate();
const courses = [
{ id: 'python', name: 'Python for Beginners', icon: '/python.png', color: '#3776ab', desc: 'Master the most popular language for AI and Web.' },
{ id: 'java', name: 'Java Masterclass', icon: '/java.png', color: '#f89820', desc: 'Build robust enterprise applications with OOP.' },
{ id: 'c', name: 'C Programming', icon: '/c.png', color: '#a8b9cc', desc: 'Understand low-level memory and system logic.' }
];

return (
<div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#f4f7f6', overflowX: 'hidden', fontFamily: 'Inter, sans-serif' }}>

<div style={{ 
background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)', 
padding: '80px 20px', 
textAlign: 'center', 
color: 'white',
marginBottom: '50px'
}}>
<h1 style={{ fontSize: '50px', margin: '0 0 20px 0', fontWeight: '800' }}>Master Your Coding Skills</h1>
<p style={{ fontSize: '20px', color: '#ccc', maxWidth: '700px', margin: '0 auto 30px' }}>
Join over 10,000+ students learning Python, Java, and C through interactive challenges and real-world projects.
</p>
<div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
<button onClick={() => window.scrollTo({top: 500, behavior: 'smooth'})} style={{ background: '#ffa116', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px' }}>Get Started</button>
<button onClick={() => navigate('/problems')} style={{ background: 'transparent', color: 'white', border: '2px solid white', padding: '15px 40px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px' }}>Practice Code</button>
</div>
</div>

<div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 80px' }}>
<h2 style={{ marginBottom: '40px', textAlign: 'center', color: '#333', fontSize: '32px' }}>Explore Specialized Tracks</h2>
<div style={{ 
display: 'grid', 
gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
gap: '30px', 
width: '100%' 
}}>
{courses.map(course => (
<div 
key={course.id} 
style={{ 
padding: '40px 30px', 
background: 'white',
borderRadius: '24px', 
boxShadow: '0 15px 35px rgba(0,0,0,0.05)', 
textAlign: 'center', 
borderTop: `10px solid ${course.color}`,
cursor: 'pointer',
transition: 'all 0.3s ease'
}}
onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
>
<div style={{ marginBottom: '20px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
<img 
src={course.icon} 
alt={course.name} 
style={{ width: '80px', height: '80px', objectFit: 'contain' }} 
/>
</div>
<h3 style={{ fontSize: '24px', color: '#333', margin: '0 0 10px' }}>{course.name}</h3>
<p style={{ color: '#666', lineHeight: '1.6', marginBottom: '25px' }}>{course.desc}</p>
<button 
onClick={() => navigate(`/course/${course.id}`)}
style={{ 
background: course.color, 
color: 'white', 
border: 'none', 
padding: '12px 0', 
borderRadius: '12px', 
cursor: 'pointer', 
fontWeight: 'bold',
fontSize: '16px',
width: '100%',
boxShadow: `0 4px 14px 0 ${course.color}66`
}}>
Start Learning
</button>
</div>
))}
</div>

<div style={{ marginTop: '100px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', textAlign: 'center' }}>
<div>
<div style={{ fontSize: '40px', color: '#2db55d' }}>🚀</div>
<h4 style={{ margin: '15px 0 10px' }}>Instant Execution</h4>
<p style={{ color: '#777' }}>Write and run your code directly in the browser with our built-in compiler.</p>
</div>
<div>
<div style={{ fontSize: '40px', color: '#007bff' }}>🏆</div>
<h4 style={{ margin: '15px 0 10px' }}>Earn Badges</h4>
<p style={{ color: '#777' }}>Complete course quizzes and solve hard problems to unlock exclusive profile badges.</p>
</div>
<div>
<div style={{ fontSize: '40px', color: '#ffa116' }}>📈</div>
<h4 style={{ margin: '15px 0 10px' }}>Track Progress</h4>
<p style={{ color: '#777' }}>Visualize your learning journey with our detailed performance analytics.</p>
</div>
</div>
</div>

<div style={{ background: '#1a1a1a', padding: '40px 20px', textAlign: 'center', color: '#888' }}>
<p>© 2026 CodeMaster Learning Platform. All rights reserved.</p>
<div style={{ marginTop: '10px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
<span style={{ cursor: 'pointer' }}>About</span>
<span style={{ cursor: 'pointer' }}>Terms</span>
<span style={{ cursor: 'pointer' }}>Privacy</span>
</div>
</div>
</div>
);
};

export default Home;