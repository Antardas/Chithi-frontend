import axios from 'axios';

export const BASE_URL: string = `${import.meta.env.VITE_BASE_ENDPOINT}/api/v1`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
});
console.log(axiosInstance.defaults.headers, 'headers');

axiosInstance.interceptors.request.use(
  function (config) {
    axios.defaults.headers['Authorization'] = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default axiosInstance;
