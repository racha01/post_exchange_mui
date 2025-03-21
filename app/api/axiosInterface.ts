import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7287/api',
  timeout: 60000,
});

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default axiosInstance;