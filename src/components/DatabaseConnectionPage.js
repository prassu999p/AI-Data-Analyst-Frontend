import React, { useState, useEffect } from 'react';
import DatabaseConnectionForm from './DatabaseConnectionForm';
import DatabaseConnectionList from './DatabaseConnectionList';
import { dbConnectionService } from '../services/dbConnections';
import { toast } from 'react-toastify';

const DatabaseConnectionPage = () => {
    const [connections, setConnections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [connectionToEdit, setConnectionToEdit] = useState(null);

    useEffect(() => {
        loadConnections();
    }, []);

    const loadConnections = async () => {
        setIsLoading(true);
        try {
            const result = await dbConnectionService.getConnections();
            setConnections(result.data || []);
        } catch (error) {
            console.error('Failed to load connections:', error);
            toast.error('Failed to load connections');
            setConnections([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnectionAdded = (newConnection) => {
        setConnections(prev => [...prev, newConnection]);
        setShowForm(false);
    };

    const handleConnectionUpdated = (updatedConnection) => {
        setConnections(prev => 
            prev.map(conn => 
                conn.id === updatedConnection.id ? updatedConnection : conn
            )
        );
        setShowForm(false);
        setConnectionToEdit(null);
    };

    const handleConnectionDeleted = (deletedId) => {
        setConnections(prev => prev.filter(conn => conn.id !== deletedId));
    };

    const handleEditConnection = (connection) => {
        setConnectionToEdit(connection);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setConnectionToEdit(null);
    };

    if (isLoading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Database Connections</h1>
                {!showForm && (
                    <button 
                        className="add-connection-btn"
                        onClick={() => setShowForm(true)}
                    >
                        Add Connection
                    </button>
                )}
            </div>

            {showForm ? (
                <DatabaseConnectionForm 
                    onConnectionAdded={handleConnectionAdded}
                    onConnectionUpdated={handleConnectionUpdated}
                    onCancel={handleCancelForm}
                    connectionToEdit={connectionToEdit}
                />
            ) : (
                <DatabaseConnectionList
                    connections={connections}
                    onConnectionDeleted={handleConnectionDeleted}
                    onEditConnection={handleEditConnection}
                />
            )}
        </div>
    );
};

export default DatabaseConnectionPage; 