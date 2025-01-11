import axiosInstance from './axiosConfig';

export const sendQuery = async (data) => {
  try {
    const response = await axiosInstance.post('/query', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add other API calls here... 