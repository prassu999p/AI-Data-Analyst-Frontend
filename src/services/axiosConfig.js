import axios from 'axios';
import config from '../config';

// Create axios instance with base URL from config
const axiosInstance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance; 