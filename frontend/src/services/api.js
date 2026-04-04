import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000'
});

export const fetchProblems = () => API.get('/');
// You can add more API calls here as we build the backend routes