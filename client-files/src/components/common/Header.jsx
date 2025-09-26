import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

import "./Header.css";

const API_URL = import.meta.env.VITE_API_URL

function Header() {
  const navigate = useNavigate();
  const { logout, userId } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("John Doe")
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    axios.post(`${API_URL}/api/users/get-user-details`, { user_id: userId })
      .then((response) => {
        setUserName(response.data.data[0].name);
      })
      .catch((error) => {
        console.error('Error fetching patient data:', error);
      });
  }, []);


  const handleProfile = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-right-global" ref={menuRef}>
          <span className="user-info">{userName}</span>
          <FaUserCircle
            style={{ color: 'grey', fontSize: '34px' }}
            onClick={() => setMenuOpen((prev) => !prev)}
          />

          {menuOpen && (
            <div className="profile-menu">
              <button onClick={handleProfile}>Profile</button>
              <button onClick={handleLogout}>Log Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
