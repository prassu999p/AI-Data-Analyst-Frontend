import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../lib/supabase';
import { toast } from 'react-toastify';
import './Layout.css';

const Layout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    return (
        <div className="app-container">
            <header className="header">
                <div className="logo">
                    <NavLink to="/" className="logo-text">
                        DataViz AI
                    </NavLink>
                </div>
                <nav className="nav-links">
                    <NavLink 
                        to="/"
                        className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        to="/connections"
                        className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
                    >
                        Database Connections
                    </NavLink>
                </nav>
                <div className="user-section">
                    <span className="user-email">{user?.email}</span>
                    <button 
                        onClick={handleSignOut}
                        className="sign-out-button"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="main">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout; 