import axios from 'axios';
import config from '../config';

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout
  timeout: 10000,
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Received response:', response.status);
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error - Please check if the API server is running');
    } else if (error.response) {
      console.error('Response Error:', error.response.status, error.response.data);
    } else {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 