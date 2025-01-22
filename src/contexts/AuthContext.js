import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            if (error) {
                console.error('Error getting session:', error);
                toast.error('Session error. Please log in again.');
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event);
            setSession(session);
            setUser(session?.user ?? null);

            // Handle different auth events
            switch (event) {
                case 'SIGNED_IN':
                    toast.success('Successfully signed in!');
                    break;
                case 'SIGNED_OUT':
                    toast.info('Signed out');
                    break;
                case 'TOKEN_REFRESHED':
                    console.log('Session token refreshed');
                    break;
                case 'USER_UPDATED':
                    toast.success('Profile updated');
                    break;
                default:
                    break;
            }
        });

        // Cleanup subscription
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Refresh session if token is about to expire
    useEffect(() => {
        if (session) {
            const expiresAt = new Date(session.expires_at * 1000);
            const timeUntilExpiry = expiresAt - new Date();
            
            // Refresh token 5 minutes before expiry
            const refreshTimeout = setTimeout(async () => {
                const { error } = await supabase.auth.refreshSession();
                if (error) {
                    console.error('Error refreshing session:', error);
                    toast.error('Session expired. Please log in again.');
                }
            }, timeUntilExpiry - 5 * 60 * 1000);

            return () => clearTimeout(refreshTimeout);
        }
    }, [session]);

    const value = {
        user,
        session,
        loading,
        signIn: async (email, password) => {
            try {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
            } catch (error) {
                toast.error(error.message);
                throw error;
            }
        },
        signUp: async (email, password) => {
            try {
                const { error } = await supabase.auth.signUp({
                    email,
                    password
                });
                if (error) throw error;
                toast.success('Verification email sent! Please check your inbox.');
            } catch (error) {
                toast.error(error.message);
                throw error;
            }
        },
        signOut: async () => {
            try {
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
            } catch (error) {
                toast.error(error.message);
                throw error;
            }
        },
        resetPassword: async (email) => {
            try {
                const { error } = await supabase.auth.resetPasswordForEmail(email);
                if (error) throw error;
                toast.success('Password reset instructions sent to your email!');
            } catch (error) {
                toast.error(error.message);
                throw error;
            }
        },
        updatePassword: async (newPassword) => {
            try {
                const { error } = await supabase.auth.updateUser({
                    password: newPassword
                });
                if (error) throw error;
                toast.success('Password updated successfully!');
            } catch (error) {
                toast.error(error.message);
                throw error;
            }
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 