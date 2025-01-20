import React, { useState, useEffect } from 'react';
import { dbConnectionService } from '../services/dbConnections';
import { toast } from 'react-toastify';

const DatabaseConnectionForm = ({ onConnectionAdded, onConnectionUpdated, onCancel, connectionToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
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
                    const result = await dbConnectionService.getConnection(connectionToEdit.id);
                    setFormData(result.data);
                } catch (error) {
                    toast.error('Failed to load connection details');
                    onCancel();
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
            await dbConnectionService.testConnection(formData);
            toast.success('Connection test successful!');
        } catch (error) {
            toast.error(`Connection test failed: ${error.detail || error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isEditMode) {
                const result = await dbConnectionService.updateConnection(connectionToEdit.id, formData);
                toast.success('Database connection updated successfully!');
                if (onConnectionUpdated) {
                    onConnectionUpdated(result.data);
                }
            } else {
                const result = await dbConnectionService.addConnection(formData);
                toast.success('Database connection added successfully!');
                if (onConnectionAdded) {
                    onConnectionAdded(result.data);
                }
            }
        } catch (error) {
            toast.error(`Failed to ${isEditMode ? 'update' : 'add'} connection: ${error.detail || error}`);
        } finally {
            setIsLoading(false);
        }
    };

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
                    />
                </div>
                <div className="form-group">
                    <label>Host</label>
                    <input
                        type="text"
                        name="host"
                        value={formData.host}
                        onChange={handleChange}
                        required
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
                    />
                    {isEditMode && (
                        <small className="input-help">Leave blank to keep current password</small>
                    )}
                </div>
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="cancel-btn"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleTestConnection}
                        className="test-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Testing...' : 'Test Connection'}
                    </button>
                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Connection' : 'Add Connection')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DatabaseConnectionForm; 