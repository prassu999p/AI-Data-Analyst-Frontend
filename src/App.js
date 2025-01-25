import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/Login';
import AuthCallback from './components/AuthCallback';
import HomePage from './components/HomePage';
import DatabaseConnectionsPage from './components/DatabaseConnectionsPage';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ToastContainer position="top-right" />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} />
                    </Route>

                    {/* Auth Routes */}
                    <Route path="/auth">
                        <Route path="login" element={<Login />} />
                        <Route path="callback" element={<AuthCallback />} />
                    </Route>

                    {/* Protected Routes */}
                    <Route path="/connections" element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<DatabaseConnectionsPage />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
