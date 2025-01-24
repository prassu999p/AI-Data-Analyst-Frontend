import axios from 'axios';
import { API_BASE_URL } from '../config';

export const queryService = {
    executeQuery: async (queryData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/query`, queryData);
            return { data: response.data, error: null };
        } catch (error) {
            return {
                data: null,
                error: {
                    message: error.response?.data?.detail || error.message || 'Failed to execute query'
                }
            };
        }
    }
}; 