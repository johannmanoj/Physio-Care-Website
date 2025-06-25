// import React from 'react';
// import LoginPage from './LoginPage.jsx';
// import './App.css';

// function App() {
//   return (
//     <LoginPage />
//   );
// }

// export default App;



import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./LoginPage";
import HomePage from "./components/HomePage";

export default function App() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return null;          // or a nice loader

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
