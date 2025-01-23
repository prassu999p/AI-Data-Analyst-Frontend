import React, { useState, useEffect } from 'react';
import { dbConnectionService } from '../services/dbConnections';
import { toast } from 'react-toastify';

const DatabaseConnectionForm = ({ onConnectionAdded, onConnectionUpdated, onCancel, connectionToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'postgresql',
        host: '',
        port: 5432,
        database: '',
        username: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = !!connectionToEdit;

    useEffect(() => {
        if (connectionToEdit) {
            // Load the connection details when editing
            const loadConnection = async () => {
                try {
                    setIsLoading(true);
                    const result = await dbConnectionService.getConnection(connectionToEdit.id);
                    if (result.data) {
                        setFormData({
                            ...result.data,
                            password: '' // Don't populate password for security
                        });
                    }
                } catch (error) {
                    console.error('Failed to load connection details:', error);
                    toast.error('Failed to load connection details');
                    onCancel();
                } finally {
                    setIsLoading(false);
                }
            };
            loadConnection();
        }
    }, [connectionToEdit, onCancel]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'port' ? parseInt(value) || '' : value
        }));
    };

    const handleTestConnection = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEditMode) {
                // Test existing connection
                await dbConnectionService.testConnection(connectionToEdit.id);
            } else {
                // Verify new connection
                await dbConnectionService.verifyConnection(formData);
            }
            toast.success('Connection test successful!');
        } catch (error) {
            console.error('Connection test failed:', error);
            toast.error(`Connection test failed: ${error.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let result;
            if (isEditMode) {
                // Don't send password if it hasn't been changed
                const updateData = {
                    ...formData,
                    password: formData.password || undefined
                };
                result = await dbConnectionService.updateConnection(connectionToEdit.id, updateData);
                toast.success('Database connection updated successfully!');
                if (onConnectionUpdated) {
                    onConnectionUpdated(result.data);
                }
            } else {
                result = await dbConnectionService.addConnection(formData);
                toast.success('Database connection added successfully!');
                if (onConnectionAdded) {
                    onConnectionAdded(result.data);
                }
            }
        } catch (error) {
            console.error('Failed to save connection:', error);
            toast.error(`Failed to ${isEditMode ? 'update' : 'add'} connection: ${error.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !formData.name) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="connection-form">
            <h2 className="form-title">{isEditMode ? 'Edit Connection' : 'Add New Connection'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Connection Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                    />
                </div>
                <div className="form-group">
                    <label>Database Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="postgresql">PostgreSQL</option>
                        <option value="mysql">MySQL</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Host</label>
                    <input
                        type="text"
                        name="host"
                        value={formData.host}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                    />
                </div>
                <div className="form-group">
                    <label>Port</label>
                    <input
                        type="number"
                        name="port"
                        value={formData.port}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                    />
                </div>
                <div className="form-group">
                    <label>Database Name</label>
                    <input
                        type="text"
                        name="database"
                        value={formData.database}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                    />
                </div>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={!isEditMode}
                        placeholder={isEditMode ? '••••••••' : ''}
                        autoComplete="current-password"
                    />
                    {isEditMode && (
                        <small className="input-help">Leave blank to keep current password</small>
                    )}
                </div>
                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={handleTestConnection}
                        disabled={isLoading}
                        className="test-button"
                    >
                        {isLoading ? 'Testing...' : 'Test Connection'}
                    </button>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="submit-button"
                    >
                        {isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Add')}
                    </button>
                    <button 
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DatabaseConnectionForm; 