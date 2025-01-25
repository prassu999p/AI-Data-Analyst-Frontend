import axios from 'axios';
import { API_BASE_URL } from '../config';

export const dbConnectionService = {
    testConnection: async (connectionData) => {
        try {
            // Format the connection data to match the backend's expected structure
            const formattedData = {
                type: connectionData.type.toLowerCase(),  // ensure lowercase type
                host: connectionData.host,
                port: connectionData.port.toString(),  // ensure port is string
                database_name: connectionData.database,
                username: connectionData.username,
                password: connectionData.password,
                ssl: {
                    rejectUnauthorized: false,
                    sslmode: 'require'
                }
            };

            console.log('Testing connection with:', {
                ...formattedData,
                password: '******' // Hide password in logs
            });

            const response = await axios.post(`${API_BASE_URL}/test-connection`, formattedData);
            
            return { 
                status: response.data.status,
                message: response.data.message,
                version: response.data.version
            };
        } catch (error) {
            console.error('Test connection error:', error.response?.data || error);
            
            // Get the error message from the response
            let errorMessage = 'Failed to test connection';
            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.response?.status === 404) {
                errorMessage = 'Connection endpoint not found. Please check your API configuration.';
            } else if (error.response?.status === 500) {
                errorMessage = 'Internal server error. Please try again later.';
            }

            throw { 
                detail: errorMessage,
                status: error.response?.status || 500
            };
        }
    },

    executeQuery: async (queryData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/query`, queryData);
            return response.data;
        } catch (error) {
            console.error('Query execution error:', error.response?.data || error);
            
            let errorMessage = 'Failed to execute query';
            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            }

            throw { 
                detail: errorMessage,
                status: error.response?.status || 500
            };
        }
    }
}; 