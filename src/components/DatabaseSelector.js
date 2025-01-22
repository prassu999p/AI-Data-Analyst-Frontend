import React, { useState, useEffect } from 'react';
import { dbConnectionService } from '../services/dbConnections';
import { toast } from 'react-toastify';
import './DatabaseSelector.css';

const DatabaseSelector = ({ onConnectionSelect, selectedConnectionId }) => {
    const [connections, setConnections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadConnections();
    }, []);

    const loadConnections = async () => {
        try {
            const result = await dbConnectionService.getConnections();
            const connectionsList = result?.data || [];
            setConnections(connectionsList);
            
            // If there's only one connection and no selection, auto-select it
            if (connectionsList.length === 1 && !selectedConnectionId) {
                handleConnectionSelect(connectionsList[0]);
            }
        } catch (error) {
            console.error('Failed to load connections:', error);
            toast.error('Failed to load database connections');
            setConnections([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnectionSelect = async (connection) => {
        if (!connection) {
            onConnectionSelect(null);
            return;
        }

        try {
            // Load full connection details
            const result = await dbConnectionService.getConnection(connection.id);
            if (result.data) {
                onConnectionSelect(result.data);
            } else {
                toast.error('Failed to load connection details');
                onConnectionSelect(null);
            }
        } catch (error) {
            console.error('Failed to load connection details:', error);
            toast.error('Failed to load connection details');
            onConnectionSelect(null);
        }
    };

    const handleChange = (e) => {
        const connectionId = e.target.value;
        if (!connectionId) {
            onConnectionSelect(null);
            return;
        }

        const selectedConnection = connections.find(conn => conn.id === connectionId);
        if (selectedConnection) {
            handleConnectionSelect(selectedConnection);
        }
    };

    if (isLoading) {
        return (
            <div className="database-selector loading">
                <div className="spinner"></div>
                <span>Loading connections...</span>
            </div>
        );
    }

    if (!connections.length) {
        return (
            <div className="database-selector empty">
                <p>No database connections available. Please add a connection first.</p>
            </div>
        );
    }

    return (
        <div className="database-selector">
            <select
                value={selectedConnectionId || ''}
                onChange={handleChange}
                className="connection-select"
            >
                <option value="">Select Database Connection</option>
                {connections.map(conn => (
                    <option key={conn.id} value={conn.id}>
                        {conn.name} ({conn.type} - {conn.database})
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DatabaseSelector; 