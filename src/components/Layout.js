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
            navigate('/auth/login');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    const handleSignIn = () => {
        navigate('/auth/login');
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
                    {user && (
                        <NavLink 
                            to="/connections"
                            className={({ isActive }) => `nav-button ${isActive ? 'active' : ''}`}
                        >
                            Database Connections
                        </NavLink>
                    )}
                </nav>
                <div className="user-section">
                    {user ? (
                        <>
                            <span className="user-email">{user.email}</span>
                            <button 
                                onClick={handleSignOut}
                                className="auth-button sign-out"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <button 
                                onClick={handleSignIn}
                                className="auth-button sign-in"
                            >
                                Sign in with Google
                            </button>
                            <button 
                                onClick={handleSignIn}
                                className="auth-button sign-up"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="main">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout; 