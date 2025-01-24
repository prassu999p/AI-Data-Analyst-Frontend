import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signIn, signUp } from '../lib/supabase';
import { toast } from 'react-toastify';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = isSignUp 
                ? await signUp(email, password)
                : await signIn(email, password);
            
            if (error) throw error;
            
            toast.success(isSignUp ? 'Account created successfully' : 'Logged in successfully');
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.message || `Failed to ${isSignUp ? 'sign up' : 'log in'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Welcome to DataViz AI</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            disabled={isLoading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading 
                            ? (isSignUp ? 'Creating Account...' : 'Logging in...') 
                            : (isSignUp ? 'Create Account' : 'Log In')}
                    </button>
                </form>
                <div className="auth-switch">
                    <button 
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="switch-button"
                        disabled={isLoading}
                    >
                        {isSignUp 
                            ? 'Already have an account? Log in' 
                            : "Don't have an account? Sign up"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 