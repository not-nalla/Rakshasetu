import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { setToken, clearToken } from '../utils/api';
import { getMe } from '../services/authService';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('kavach_token');
    if (storedToken) {
      setToken(storedToken);
      getMe()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          clearToken();
          sessionStorage.removeItem('kavach_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearToken();
    sessionStorage.removeItem('kavach_token');
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const storeToken = useCallback((token) => {
    setToken(token);
    sessionStorage.setItem('kavach_token', token);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, login, logout, updateUser, storeToken }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserContext must be used within UserProvider');
  return ctx;
}
