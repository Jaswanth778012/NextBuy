import { useState, useEffect } from 'react';

const getStoredUser = () => {
    try {
        const raw = localStorage.getItem('user');
        if (!raw || raw === 'null' || raw === 'undefined' || raw === '') return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
};

const getStoredToken = () => {
    const token = localStorage.getItem('token');
    if (!token || token === 'null' || token === 'undefined' || token === '') return null;
    return token;
};

export const useAuth = () => {
    const [authState, setAuthState] = useState(() => ({
        user: getStoredUser(),
        token: getStoredToken(),
    }));

    useEffect(() => {
        const handleAuthChange = () => {
            setAuthState({
                user: getStoredUser(),
                token: getStoredToken(),
            });
        };

        window.addEventListener('auth-change', handleAuthChange);
        window.addEventListener('storage', handleAuthChange);
        
        return () => {
            window.removeEventListener('auth-change', handleAuthChange);
            window.removeEventListener('storage', handleAuthChange);
        };
    }, []);

    const isLoggedIn = !!authState.user && !!authState.token;
    
    return {
        user: authState.user,
        isLoggedIn,
        role: authState.user?.role || localStorage.getItem('role') || null,
        token: authState.token,
    };
};

export const notifyAuthChange = () => {
    window.dispatchEvent(new Event('auth-change'));
};