import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authenticate, STORAGE_KEY, TOKEN_SECRET } from './authService';
import { verifyToken } from './jwt';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('checking'); // checking | authenticated | guest
  const [sessionNotice, setSessionNotice] = useState(null);

  const clearSession = useCallback((notice) => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
    setStatus('guest');
    if (notice) setSessionNotice(notice);
  }, []);

  const establishSession = useCallback((nextToken, payload) => {
    localStorage.setItem(STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(payload);
    setStatus('authenticated');
    setSessionNotice(null);
  }, []);

  // On first load, look for a token left over from a previous visit and
  // verify it before trusting it — this is the "validate token securely"
  // requirement from Experiment 1 applied to page refreshes.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setStatus('guest');
      return;
    }
    verifyToken(stored, TOKEN_SECRET).then((result) => {
      if (result.valid) {
        establishSession(stored, result.payload);
      } else {
        clearSession(result.reason === 'expired' ? 'Your session expired. Please sign in again.' : null);
      }
    });
    // Only ever run once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto sign-out the moment the token's exp claim is reached while the tab
  // stays open, demonstrating stateless session expiry without polling.
  useEffect(() => {
    if (!user?.exp) return undefined;
    const msRemaining = user.exp * 1000 - Date.now();
    if (msRemaining <= 0) {
      clearSession('Your session expired. Please sign in again.');
      return undefined;
    }
    const timer = setTimeout(() => {
      clearSession('Your session expired. Please sign in again.');
    }, msRemaining);
    return () => clearTimeout(timer);
  }, [user, clearSession]);

  const login = useCallback(
    async (username, password) => {
      const nextToken = await authenticate(username, password);
      const result = await verifyToken(nextToken, TOKEN_SECRET);
      establishSession(nextToken, result.payload);
      return result.payload;
    },
    [establishSession],
  );

  const logout = useCallback(() => clearSession(null), [clearSession]);

  const hasRole = useCallback(
    (allowedRoles) => {
      if (!allowedRoles || allowedRoles.length === 0) return true;
      return !!user && allowedRoles.includes(user.role);
    },
    [user],
  );

  const value = useMemo(
    () => ({
      token,
      user,
      status,
      sessionNotice,
      isAuthenticated: status === 'authenticated',
      login,
      logout,
      hasRole,
    }),
    [token, user, status, sessionNotice, login, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
