import axios from 'axios';

const BASE_URL: string = `${import.meta.env.VITE_BASE_ENDPOINT}/api/v1`;


axios.defaults.headers['Authorization'] = window.localStorage.getItem('token') || 'TestToken';
export default axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
});
