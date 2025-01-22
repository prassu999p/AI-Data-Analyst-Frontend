import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import DatabaseConnectionsPage from './components/DatabaseConnectionsPage';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ToastContainer position="top-right" />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    
                    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route index element={<HomePage />} />
                        <Route path="connections" element={<DatabaseConnectionsPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
