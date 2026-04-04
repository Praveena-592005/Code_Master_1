import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProblemPage from './pages/ProblemPage';
import ProblemList from './pages/ProblemList';
import CoursePage from './pages/CoursePage';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizPage from './pages/QuizPage';
import Navbar from './components/Navbar';

function App() {
return (
<Router>
<Navbar />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/problems" element={<ProblemList />} />
<Route path="/problem/:id" element={<ProblemPage />} />
<Route path="/learning" element={<Dashboard />} />
<Route path="/course/:courseId" element={<CoursePage />} />
<Route path="/quiz/:courseId" element={<QuizPage />} />
<Route path="/profile" element={<Profile />} />
<Route path="/badges" element={<Profile />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/dashboard" element={<Dashboard />} />
</Routes>
</Router>
);
}

export default App;