import React from 'react';
import { dbConnectionService } from '../services/dbConnections';
import { toast } from 'react-toastify';

const DatabaseConnectionList = ({ connections, onConnectionDeleted, onEditConnection, onConnectionSelected, selectedConnectionId }) => {
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this connection?')) {
            try {
                await dbConnectionService.deleteConnection(id);
                toast.success('Connection deleted successfully');
                if (onConnectionDeleted) {
                    onConnectionDeleted(id);
                }
            } catch (error) {
                console.error('Failed to delete connection:', error);
                toast.error(`Failed to delete connection: ${error.message || 'Unknown error'}`);
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
                <div 
                    key={connection.id} 
                    className={`connection-item ${selectedConnectionId === connection.id ? 'selected' : ''}`}
                    onClick={() => onConnectionSelected && onConnectionSelected(connection)}
                >
                    <div className="connection-info">
                        <h3>{connection.name}</h3>
                        <p>{connection.type} - {connection.host}:{connection.port} - {connection.database}</p>
                    </div>
                    <div className="connection-actions">
                        <button 
                            className="edit-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditConnection(connection);
                            }}
                        >
                            Edit
                        </button>
                        <button 
                            className="delete-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(connection.id);
                            }}
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