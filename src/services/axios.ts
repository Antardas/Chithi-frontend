import axios from 'axios';

export const BASE_URL: string = `${import.meta.env.VITE_BASE_ENDPOINT}/api/v1`;

export default axios
  .create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    withCredentials: true
  })
  .interceptors.request.use((config) => {
    config.headers['Authorization'] = window.localStorage.getItem('token') || 'TestToken';
    return config;
  });
