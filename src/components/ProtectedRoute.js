import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        // Redirect to login but save the attempted location
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute; 