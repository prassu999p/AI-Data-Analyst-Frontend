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
                password: connectionData.password
            };

            console.log('Testing connection with:', {
                ...formattedData,
                password: '******' // Hide password in logs
            });

            const response = await axios.post(`${API_BASE_URL}/test-connection`, formattedData);
            
            // Show success message with database version if available
            if (response.data.version) {
                console.log(`Connected successfully to ${formattedData.type} database:`, response.data.version);
            }
            
            return { 
                data: response.data,
                message: response.data.message || 'Connection successful'
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

            // Log the complete error for debugging
            console.error('Complete error:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });

            throw { 
                detail: errorMessage,
                status: error.response?.status || 500
            };
        }
    },

    addConnection: async (connectionData) => {
        try {
            // Format the connection data
            const formattedData = {
                type: connectionData.type,
                host: connectionData.host,
                port: parseInt(connectionData.port),
                database_name: connectionData.database,
                username: connectionData.username,
                password: connectionData.password,
                name: connectionData.name,
                ssl: {
                    rejectUnauthorized: false,
                    sslmode: 'require'
                }
            };

            console.log('Adding connection:', {
                ...formattedData,
                password: '******' // Hide password in logs
            });

            const response = await axios.post(`${API_BASE_URL}/connections`, formattedData);
            return { data: response.data };
        } catch (error) {
            console.error('Add connection error:', error.response?.data || error);
            let errorMessage = 'Failed to add connection';

            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            }

            throw { detail: errorMessage };
        }
    },

    updateConnection: async (id, connectionData) => {
        try {
            // Format the connection data
            const formattedData = {
                type: connectionData.type,
                host: connectionData.host,
                port: parseInt(connectionData.port),
                database_name: connectionData.database,
                username: connectionData.username,
                password: connectionData.password,
                name: connectionData.name,
                ssl: {
                    rejectUnauthorized: false,
                    sslmode: 'require'
                }
            };

            console.log('Updating connection:', {
                ...formattedData,
                password: '******' // Hide password in logs
            });

            const response = await axios.put(`${API_BASE_URL}/connections/${id}`, formattedData);
            return { data: response.data };
        } catch (error) {
            console.error('Update connection error:', error.response?.data || error);
            let errorMessage = 'Failed to update connection';

            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            }

            throw { detail: errorMessage };
        }
    },

    getConnections: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/connections`);
            return { data: response.data };
        } catch (error) {
            console.error('Get connections error:', error.response?.data || error);
            let errorMessage = 'Failed to get connections';

            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            }

            throw { detail: errorMessage };
        }
    },

    getConnection: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/connections/${id}`);
            return { data: response.data };
        } catch (error) {
            console.error('Get connection error:', error.response?.data || error);
            let errorMessage = 'Failed to get connection';

            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            }

            throw { detail: errorMessage };
        }
    },

    deleteConnection: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/connections/${id}`);
            return { data: response.data };
        } catch (error) {
            console.error('Delete connection error:', error.response?.data || error);
            let errorMessage = 'Failed to delete connection';

            if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            }

            throw { detail: errorMessage };
        }
    }
}; 