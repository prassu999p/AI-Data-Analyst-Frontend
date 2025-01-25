import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../lib/supabase';
import './AuthButton.css';

const AuthButton = ({ user }) => {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        const { error } = await signOut();
        if (!error) {
            navigate('/');
        }
    };

    const handleSignIn = () => {
        navigate('/auth/login');
    };

    if (user) {
        return (
            <div className="auth-container">
                <span className="user-email">{user.email}</span>
                <button onClick={handleSignOut} className="auth-button sign-out">
                    Sign Out
                </button>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <button onClick={handleSignIn} className="auth-button sign-in">
                Sign In
            </button>
        </div>
    );
};

export default AuthButton; 