import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // ⬅️ store role here
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedRole = localStorage.getItem("auth_role");

    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      if (savedRole) setRole(savedRole);
    }
    setLoading(false);
  }, []);

  const login = (newToken, userRole) => {
    setToken(newToken);
    setRole(userRole);
    setIsLoggedIn(true);
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_role", userRole);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setIsLoggedIn(false);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_role");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, token, role, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
