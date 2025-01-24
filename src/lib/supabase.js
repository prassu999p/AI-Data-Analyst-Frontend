import { createClient } from '@supabase/supabase-js';
import { encryptSensitiveData, decryptSensitiveData } from '../utils/encryption';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getCurrentUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

export const signIn = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

export const signUp = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
    } catch (error) {
        return { error };
    }
};

// Function to test database connection
export const testDatabaseConnection = async (connectionData) => {
    try {
        // Send the raw connection data for testing
        const response = await axios.post(`${API_BASE_URL}/test-connection`, connectionData);
        return { data: response.data, error: null };
    } catch (error) {
        return { 
            data: null, 
            error: {
                message: error.response?.data?.detail || error.message || 'Failed to test connection'
            }
        };
    }
};

// Helper function to handle database connections
export const getDatabaseConnections = async () => {
    try {
        const { data, error } = await supabase
            .from('user_connections')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Decrypt sensitive data before returning
        const decryptedData = data.map(connection => 
            decryptSensitiveData(connection)
        );
        
        return { data: decryptedData, error: null };
    } catch (error) {
        return { data: null, error };
    }
};

export const createDatabaseConnection = async (connectionData) => {
    try {
        // Log the incoming data (without sensitive info)
        console.log('Creating connection for:', {
            ...connectionData,
            password: '[REDACTED]'
        });

        // Encrypt sensitive data before storing
        const encryptedData = encryptSensitiveData(connectionData);
        
        console.log('Attempting to insert connection into Supabase');
        const { data, error } = await supabase
            .from('user_connections')
            .insert([encryptedData])
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        console.log('Connection created successfully');
        return { data, error: null };
    } catch (error) {
        console.error('Failed to create connection:', error);
        return { 
            data: null, 
            error: {
                message: error.message || 'Failed to create connection',
                details: error.details || error.hint || ''
            }
        };
    }
};

export const deleteDatabaseConnection = async (connectionId) => {
    try {
        const { error } = await supabase
            .from('user_connections')
            .delete()
            .eq('id', connectionId);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        return { error };
    }
};

export const getConnection = async (id) => {
    try {
        const { data, error } = await supabase
            .from('user_connections')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        
        // Decrypt sensitive data before returning
        const decryptedData = decryptSensitiveData(data);
        
        return { data: decryptedData, error: null };
    } catch (error) {
        return { data: null, error };
    }
}; 