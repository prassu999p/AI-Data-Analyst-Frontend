import React from 'react';
import { dbConnectionService } from '../services/dbConnections';
import { toast } from 'react-toastify';

const DatabaseConnectionList = ({ connections, onConnectionDeleted, onEditConnection }) => {
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this connection?')) {
            try {
                await dbConnectionService.deleteConnection(id);
                toast.success('Connection deleted successfully');
                if (onConnectionDeleted) {
                    onConnectionDeleted(id);
                }
            } catch (error) {
                toast.error(`Failed to delete connection: ${error.detail || error}`);
            }
        }
    };

    if (!connections || connections.length === 0) {
        return (
            <div className="no-connections">
                No database connections added yet.
            </div>
        );
    }

    return (
        <div className="connections-list">
            {connections.map((connection) => (
                <div key={connection.id} className="connection-item">
                    <div className="connection-info">
                        <h3>{connection.name}</h3>
                        <p>{connection.host}:{connection.port} - {connection.database}</p>
                    </div>
                    <div className="connection-actions">
                        <button 
                            className="edit-btn"
                            onClick={() => onEditConnection(connection)}
                        >
                            Edit
                        </button>
                        <button 
                            className="delete-btn"
                            onClick={() => handleDelete(connection.id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DatabaseConnectionList; 