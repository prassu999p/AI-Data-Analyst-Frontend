import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, signInWithGoogle } from '../lib/supabase';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data, error } = isSignUp 
                ? await signUp(email, password)
                : await signIn(email, password);

            if (error) throw error;

            if (isSignUp) {
                toast.success('Please check your email to confirm your account');
            } else if (data) {
                toast.success('Successfully signed in!');
                navigate('/');
            }
        } catch (error) {
            toast.error(error.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (error) {
            toast.error('Google sign in failed');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                <p className="subtitle">
                    {isSignUp 
                        ? 'Sign up to start visualizing your data'
                        : 'Sign in to continue to DataViz AI'}
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading 
                            ? 'Loading...' 
                            : isSignUp 
                                ? 'Sign Up' 
                                : 'Sign In'}
                    </button>
                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button 
                    onClick={handleGoogleSignIn}
                    className="google-button"
                >
                    <img 
                        src="/google-icon.png" 
                        alt="Google"
                        className="google-icon"
                    />
                    Continue with Google
                </button>

                <p className="toggle-text">
                    {isSignUp 
                        ? 'Already have an account? ' 
                        : "Don't have an account? "}
                    <button
                        className="toggle-button"
                        onClick={() => setIsSignUp(!isSignUp)}
                    >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login; 