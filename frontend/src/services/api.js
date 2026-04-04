import axios from 'axios';

const API = axios.create({
    baseURL: 'https://code-master-1-8eak.onrender.com'
});

export const fetchProblems = () => API.get('/');
// You can add more API calls here as we build the backend routes