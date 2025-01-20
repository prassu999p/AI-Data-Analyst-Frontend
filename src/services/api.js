import axiosInstance from './axiosConfig';

export const sendQuery = async (data) => {
  try {
    const response = await axiosInstance.post('/query', data);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw new Error(error.response.data);
    }
    throw error;
  }
};

// Add other API calls here... 