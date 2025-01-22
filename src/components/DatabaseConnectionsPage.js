import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDatabaseConnections, createDatabaseConnection, deleteDatabaseConnection, testDatabaseConnection } from '../lib/supabase';
import { toast } from 'react-toastify';
import './DatabaseConnectionsPage.css';

const INITIAL_FORM_STATE = {
    name: '',
    type: 'postgresql',
    host: '',
    port: '',
    database_name: '',
    username: '',
    password: ''
};

const DEFAULT_PORTS = {
    postgresql: '5432',
    mysql: '3306',
    mongodb: '27017'
};

const DatabaseConnectionsPage = () => {
    const { user } = useAuth();
    const [connections, setConnections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTesting, setIsTesting] = useState(false);

    useEffect(() => {
        loadConnections();
    }, []);

    const loadConnections = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await getDatabaseConnections();
            if (error) throw error;
            setConnections(data || []);
        } catch (error) {
            toast.error('Failed to load connections');
            console.error('Error loading connections:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const errors = {};
        
        if (!formData.name.trim()) {
            errors.name = 'Connection name is required';
        }
        
        if (!formData.host.trim()) {
            errors.host = 'Host is required';
        }
        
        if (!formData.port.trim()) {
            errors.port = 'Port is required';
        } else if (!/^\d+$/.test(formData.port)) {
            errors.port = 'Port must be a number';
        }
        
        if (!formData.database_name.trim()) {
            errors.database_name = 'Database name is required';
        }
        
        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        }
        
        if (!formData.password) {
            errors.password = 'Password is required';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setIsSubmitting(false);
            return;
        }

        try {
            console.log('Submitting connection data...');
            const { data, error } = await createDatabaseConnection({
                ...formData,
                user_id: user.id
            });

            if (error) {
                console.error('Error response:', error);
                throw error;
            }

            toast.success('Connection added successfully');
            setShowAddForm(false);
            setFormData(INITIAL_FORM_STATE);
            loadConnections();
        } catch (error) {
            console.error('Full error details:', error);
            toast.error(error.message || 'Failed to add connection');
            if (error.details) {
                toast.error(`Details: ${error.details}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this connection?')) return;

        try {
            const { error } = await deleteDatabaseConnection(id);
            if (error) throw error;

            toast.success('Connection deleted successfully');
            loadConnections();
        } catch (error) {
            toast.error('Failed to delete connection');
            console.error('Error deleting connection:', error);
        }
    };

    const handleTypeChange = (e) => {
        const type = e.target.value;
        setFormData(prev => ({
            ...prev,
            type,
            port: DEFAULT_PORTS[type] || ''
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleTestConnection = async () => {
        // Validate form first
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsTesting(true);
        try {
            const { data, error } = await testDatabaseConnection(formData);
            if (error) throw error;
            toast.success(data.message || 'Connection test successful!');
        } catch (error) {
            toast.error(error.message || 'Failed to test connection');
            console.error('Error testing connection:', error);
        } finally {
            setIsTesting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading your connections...</p>
            </div>
        );
    }

    return (
        <div className="connections-container">
            <div className="connections-header">
                <h1>Database Connections</h1>
                <button 
                    className="add-button"
                    onClick={() => {
                        setShowAddForm(!showAddForm);
                        if (!showAddForm) {
                            setFormData(INITIAL_FORM_STATE);
                            setFormErrors({});
                        }
                    }}
                >
                    {showAddForm ? 'Cancel' : 'Add Connection'}
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleSubmit} className="connection-form">
                    <div className="form-group">
                        <label htmlFor="name">Connection Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={formErrors.name ? 'error' : ''}
                            disabled={isSubmitting || isTesting}
                        />
                        {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Database Type</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleTypeChange}
                            disabled={isSubmitting || isTesting}
                        >
                            <option value="postgresql">PostgreSQL</option>
                            <option value="mysql">MySQL</option>
                            <option value="mongodb">MongoDB</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="host">Host</label>
                            <input
                                id="host"
                                name="host"
                                type="text"
                                value={formData.host}
                                onChange={handleInputChange}
                                className={formErrors.host ? 'error' : ''}
                                disabled={isSubmitting || isTesting}
                            />
                            {formErrors.host && <span className="error-message">{formErrors.host}</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="port">Port</label>
                            <input
                                id="port"
                                name="port"
                                type="text"
                                value={formData.port}
                                onChange={handleInputChange}
                                className={formErrors.port ? 'error' : ''}
                                disabled={isSubmitting || isTesting}
                            />
                            {formErrors.port && <span className="error-message">{formErrors.port}</span>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="database_name">Database Name</label>
                        <input
                            id="database_name"
                            name="database_name"
                            type="text"
                            value={formData.database_name}
                            onChange={handleInputChange}
                            className={formErrors.database_name ? 'error' : ''}
                            disabled={isSubmitting || isTesting}
                        />
                        {formErrors.database_name && <span className="error-message">{formErrors.database_name}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={formErrors.username ? 'error' : ''}
                            disabled={isSubmitting || isTesting}
                        />
                        {formErrors.username && <span className="error-message">{formErrors.username}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={formErrors.password ? 'error' : ''}
                            disabled={isSubmitting || isTesting}
                        />
                        {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                    </div>
                    <div className="form-actions">
                        <button 
                            type="button"
                            className="test-button"
                            onClick={handleTestConnection}
                            disabled={isSubmitting || isTesting}
                        >
                            {isTesting ? 'Testing...' : 'Test Connection'}
                        </button>
                        <button 
                            type="submit" 
                            className="submit-button" 
                            disabled={isSubmitting || isTesting}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Connection'}
                        </button>
                    </div>
                </form>
            )}

            <div className="connections-list">
                {connections.length === 0 ? (
                    <div className="empty-state">
                        No database connections found. Add one to get started!
                    </div>
                ) : (
                    connections.map((connection) => (
                        <div key={connection.id} className="connection-card">
                            <div className="connection-info">
                                <h3>{connection.name}</h3>
                                <p className="connection-type">{connection.type}</p>
                                <p className="connection-details">
                                    {connection.host}:{connection.port} / {connection.database_name}
                                </p>
                                <p className="connection-user">User: {connection.username}</p>
                            </div>
                            <div className="connection-actions">
                                <button
                                    onClick={() => handleDelete(connection.id)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DatabaseConnectionsPage; 