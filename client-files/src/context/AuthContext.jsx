import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); 
  const [userId, setUserId] = useState(null); 
  const [branchId, setBranchId] = useState(null); 
  const [loginEmail, setLoginEmail] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedRole = localStorage.getItem("auth_role");
    const savedUserId = localStorage.getItem("auth_user_id");
    const savedBranchId = localStorage.getItem("auth_branch_id");

    if (savedToken) {
      setToken(savedToken);
      setIsLoggedIn(true);
      if (savedRole) setRole(savedRole);
      if (savedUserId) setUserId(savedUserId);
      if (savedBranchId) setBranchId(savedBranchId);
    }
    setLoading(false);
  }, []);

  const login = (newToken, userRole, userEmail, userId, branchId) => {
    setToken(newToken);
    setRole(userRole);
    setLoginEmail(userEmail);
    setUserId(userId);
    setBranchId(branchId);
    setIsLoggedIn(true);
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_role", userRole);
    localStorage.setItem("auth_name", userEmail);
    localStorage.setItem("auth_user_id", userId);
    localStorage.setItem("auth_branch_id", branchId);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    setBranchId(null);
    setLoginEmail(null);
    setIsLoggedIn(false);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_role");
    localStorage.removeItem("auth_name");
    localStorage.removeItem("auth_user_id");
    localStorage.removeItem("auth_branch_id");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, token, role, userId, branchId, loginEmail, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
