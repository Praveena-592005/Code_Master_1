// frontend/src/api.js
import axios from 'axios';

const API = axios.create({
    // Adding /api here covers all your backend routes
    baseURL: 'https://code-master-3.onrender.com/api' 
});

// Fetch all problems - hits /api/problems
export const fetchProblems = () => API.get('/problems');

// Execute code - hits /api/execute
export const executeCode = (data) => API.post('/execute', data);

// Auth: Register - hits /api/auth/register
export const registerUser = (userData) => API.post('/auth/register', userData);

// Auth: Login - hits /api/auth/login
export const loginUser = (credentials) => API.post('/auth/login', credentials);

export default API;