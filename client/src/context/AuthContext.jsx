import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

const getStoredToken = () => localStorage.getItem('token');

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getStoredToken);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const persistAuth = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem('token', nextToken);
    } else {
      localStorage.removeItem('token');
    }

    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const loadUser = useCallback(async () => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const { user: currentUser } = await authApi.getMe();
      setUser(currentUser);
      setToken(storedToken);
      setError(null);
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setError('Session expired. Please log in again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    persistAuth(data.token, data.user);
    setError(null);
    return data.user;
  };

  const register = async (email, password) => {
    const data = await authApi.register(email, password);
    persistAuth(data.token, data.user);
    setError(null);
    return data.user;
  };

  const logout = () => {
    persistAuth(null, null);
    setError(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      updateUser,
      setError,
    }),
    [user, token, loading, error, persistAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
