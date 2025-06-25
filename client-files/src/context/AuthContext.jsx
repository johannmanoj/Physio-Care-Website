import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);  // ⬅️ guards initial flash

  useEffect(() => {
    const saved = localStorage.getItem("auth_token");
    if (saved) {
      setToken(saved);
      setIsLoggedIn(true);
    }
    setLoading(false);                            // done checking storage
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    setIsLoggedIn(true);
    localStorage.setItem("auth_token", newToken);
  };

  const logout = () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
