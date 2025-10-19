import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

import axios from 'axios';
import "./Header.css";

const API_URL = import.meta.env.VITE_API_URL

function Header() {
  const navigate = useNavigate();
  const { logout, userId } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState("")
  const [user, setUser] = useState("")
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
        setUser(response.data.data[0]);
      })
      .catch((error) => {
        console.error('Error fetching patient data:', error);
      });
  }, []);


  const handleProfile = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <div
          className="header-right-global"
          ref={menuRef}
          onClick={() => setMenuOpen((prev) => !prev)}
        >

          <span className="user-info">{user.name}</span>
          {user.profile_pic ? (
            <img
              src={user.profile_pic}
              alt="Profile"
              className="profile-picture"
            />
          ) : (
            <FaUserCircle className="profile-picture" />
          )}
          {/* <FaUserCircle style={{ color: 'grey', fontSize: '34px', cursor: 'pointer' }} /> */}
          <FaChevronDown className={`arrow-icon ${menuOpen ? "rotate" : ""}`} />

          {menuOpen && (
            <div className="profile-menu">
              <div className="header-profile-dropdown-heading">
                <div className="header-menu-name">
                  {user.name}
                </div>
                <div className="header-menu-email">
                  {user.email}
                </div>
              </div>
              <div className="profile-menu-item-list">
                <div className="profile-menu-item" onClick={handleProfile}><FaUserCircle className="profile-menu-item-logo" /> Edit Profile</div>
                <div className="profile-menu-item" onClick={handleLogout}><FaSignOutAlt className="profile-menu-item-logo" /> Log Out</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
