import axios from 'axios';

const BASE_URL: string = `${import.meta.env.VITE_BASE_ENDPOINT}/api/v1`;
console.log(BASE_URL);

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
});
