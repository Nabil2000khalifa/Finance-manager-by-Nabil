import { createContext, useEffect, useState } from "react";

import { authService } from "../features/auth/auth.service.js";
import { clearSession, getStoredUser, STORAGE_KEYS, storeSession, updateStoredUser } from "../utils/storage.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEYS.token) || "");
  const [user, setUser] = useState(getStoredUser());
  const [isLoading, setIsLoading] = useState(Boolean(localStorage.getItem(STORAGE_KEYS.token)));

  useEffect(() => {
    let ignore = false;

    const syncCurrentUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();

        if (!ignore) {
          setUser(currentUser);
          updateStoredUser(currentUser);
        }
      } catch {
        if (!ignore) {
          clearSession();
          setToken("");
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    syncCurrentUser();

    return () => {
      ignore = true;
    };
  }, [token]);

  const saveAuthData = (authData) => {
    storeSession(authData);
    setToken(authData.token);
    setUser(authData.user);
  };

  const login = async (credentials) => {
    const authData = await authService.login(credentials);
    saveAuthData(authData);
    return authData;
  };

  const register = async (payload) => {
    const authData = await authService.register(payload);
    saveAuthData(authData);
    return authData;
  };

  const logout = () => {
    clearSession();
    setToken("");
    setUser(null);
    setIsLoading(false);
  };

  const refreshProfile = async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    updateStoredUser(currentUser);
    return currentUser;
  };

  const updateUser = (nextUser) => {
    setUser(nextUser);
    updateStoredUser(nextUser);
  };

  const value = {
    token,
    user,
    isLoading,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
    refreshProfile,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
