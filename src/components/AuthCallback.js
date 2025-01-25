import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) throw error;
                
                if (session) {
                    toast.success('Successfully signed in!');
                    navigate('/');
                } else {
                    toast.error('Authentication failed');
                    navigate('/auth/login');
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                toast.error('Authentication failed');
                navigate('/auth/login');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="auth-callback">
            <div className="loading">
                <p>Completing authentication...</p>
            </div>
        </div>
    );
};

export default AuthCallback; 