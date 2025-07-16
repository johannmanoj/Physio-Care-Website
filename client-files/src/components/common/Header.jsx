import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from 'react-icons/fa';


function Header() {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
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
          <span className="user-info">John Doe</span>
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
