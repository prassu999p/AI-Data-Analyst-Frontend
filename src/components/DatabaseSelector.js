import React, { useState, useEffect } from 'react';
import { dbConnectionService } from '../services/dbConnections';
import { toast } from 'react-toastify';

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
        } catch (error) {
            console.error('Failed to load connections:', error);
            toast.error('Failed to load database connections');
            setConnections([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = async (e) => {
        const connectionId = parseInt(e.target.value);
        if (connectionId) {
            try {
                const result = await dbConnectionService.getConnection(connectionId);
                onConnectionSelect(result.data);
            } catch (error) {
                toast.error('Failed to load connection details');
            }
        } else {
            onConnectionSelect(null);
        }
    };

    if (isLoading) {
        return <div className="loading">Loading connections...</div>;
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
                        {conn.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DatabaseSelector; 