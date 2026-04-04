import axios from 'axios';

const API = axios.create({
    baseURL: 'https://code-master-3.onrender.com'
});

// Fetch all problems
export const fetchProblems = () => API.get('/api/problems');

// Execute code (Run/Submit)
export const executeCode = (data) => API.post('/api/execute', data);

// Auth: Register
export const registerUser = (userData) => API.post('/api/auth/register', userData);

// Auth: Login
export const loginUser = (credentials) => API.post('/api/auth/login', credentials);

export default API;