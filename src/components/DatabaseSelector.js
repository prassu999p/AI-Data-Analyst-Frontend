import React, { useState, useEffect } from 'react';
import { getDatabaseConnections, getConnection, testDatabaseConnection } from '../lib/supabase';
import { toast } from 'react-toastify';
import './DatabaseSelector.css';

const DatabaseSelector = ({ onConnectionSelect, selectedConnectionId, connection }) => {
    const [connections, setConnections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTesting, setIsTesting] = useState(false);

    useEffect(() => {
        loadConnections();
    }, []);

    const loadConnections = async () => {
        try {
            const { data, error } = await getDatabaseConnections();
            if (error) throw error;
            setConnections(data || []);
        } catch (error) {
            console.error('Failed to load connections:', error);
            toast.error('Failed to load database connections');
            setConnections([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = async (e) => {
        const connectionId = e.target.value;
        if (connectionId) {
            try {
                const { data, error } = await getConnection(connectionId);
                if (error) throw error;
                onConnectionSelect(data);
            } catch (error) {
                toast.error('Failed to load connection details');
            }
        } else {
            onConnectionSelect(null);
        }
    };

    const handleTestConnection = async () => {
        if (!connection) {
            toast.warn('Please select a connection to test');
            return;
        }

        setIsTesting(true);
        try {
            const { data, error } = await testDatabaseConnection({
                type: connection.type,
                host: connection.host,
                port: connection.port,
                database_name: connection.database_name,
                username: connection.username,
                password: connection.password
            });
            
            if (error) throw error;
            toast.success(data.message || 'Connection test successful!');
        } catch (error) {
            console.error('Connection test failed:', error);
            toast.error(error.message || 'Connection test failed');
        } finally {
            setIsTesting(false);
        }
    };

    if (isLoading) {
        return <div className="loading">Loading connections...</div>;
    }

    return (
        <div className="database-selector">
            <div className="selector-container">
                <select
                    value={selectedConnectionId || ''}
                    onChange={handleChange}
                    className="connection-select"
                >
                    <option value="">Select Database Connection</option>
                    {connections.map(conn => (
                        <option key={conn.id} value={conn.id}>
                            {conn.name} ({conn.type} - {conn.database_name})
                        </option>
                    ))}
                </select>
                {connection && (
                    <button
                        onClick={handleTestConnection}
                        disabled={isTesting}
                        className={`test-button ${isTesting ? 'testing' : ''}`}
                    >
                        {isTesting ? 'Testing...' : 'Test Connection'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default DatabaseSelector; 