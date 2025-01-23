import axios from 'axios';
import { API_BASE_URL } from '../config';

export const dbConnectionService = {
    testConnection: async (connectionData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/test-connection`, connectionData);
            return { data: response.data };
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    addConnection: async (connectionData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/connections`, connectionData);
            return { data: response.data };
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateConnection: async (id, connectionData) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/connections/${id}`, connectionData);
            return { data: response.data };
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getConnections: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/connections`);
            return { data: response.data };
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getConnection: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/connections/${id}`);
            return { data: response.data };
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    deleteConnection: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/connections/${id}`);
            return { data: response.data };
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 