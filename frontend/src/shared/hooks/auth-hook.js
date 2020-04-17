import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const login = useCallback((userId, token, expirationDate) => {
    setUserId(userId);
    setToken(token);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({ userId, token, expiration: tokenExpirationDate.toISOString() }),
    );
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    localStorage.clear();
  }, []);
  useEffect(() => {
    const storeData = JSON.parse(localStorage.getItem('userData'));
    if (storeData && storeData.token && new Date(storeData.expiration) > new Date()) {
      login(storeData.userId, storeData.token, new Date(storeData.expiration));
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTimer = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTimer);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [logout, token, tokenExpirationDate]);

  return {
    userId,
    login,
    logout,
    token,
  };
};
