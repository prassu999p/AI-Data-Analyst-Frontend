import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class DbConnectionService {
    async getConnections() {
        try {
            const response = await axios.get(`${API_URL}/connections`);
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    async getConnection(id) {
        try {
            const response = await axios.get(`${API_URL}/connections/${id}`);
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    async addConnection(connectionData) {
        try {
            const response = await axios.post(`${API_URL}/connections`, connectionData);
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    async updateConnection(id, connectionData) {
        try {
            const response = await axios.put(`${API_URL}/connections/${id}`, connectionData);
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    async deleteConnection(id) {
        try {
            const response = await axios.delete(`${API_URL}/connections/${id}`);
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    async testConnection(connectionId) {
        try {
            const response = await axios.post(`${API_URL}/connections/test`, {
                connection_id: connectionId
            });
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    async verifyConnection(connectionData) {
        try {
            const response = await axios.post(`${API_URL}/connections/verify`, connectionData);
            return response.data;
        } catch (error) {
            throw this._handleError(error);
        }
    }

    _handleError(error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorMessage = error.response.data.detail || error.response.data.message || 'An error occurred';
            const enhancedError = new Error(errorMessage);
            enhancedError.status = error.response.status;
            enhancedError.detail = errorMessage;
            return enhancedError;
        } else if (error.request) {
            // The request was made but no response was received
            return new Error('No response received from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            return error;
        }
    }
}

export const dbConnectionService = new DbConnectionService(); 