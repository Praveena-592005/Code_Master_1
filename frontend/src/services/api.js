import axios from 'axios';

const API = axios.create({
    // Adding /api here saves you from typing it every time below
    baseURL: 'https://onrender.com' 
});

// Now this will call: https://onrender.com/problems
export const fetchProblems = () => API.get('/problems');

// You can now easily add your other routes:
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
