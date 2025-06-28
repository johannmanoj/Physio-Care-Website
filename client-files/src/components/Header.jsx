// import React from 'react';
// import './Header.css';
// import { useAuth } from "../context/AuthContext";


// function Header() {
//   const { isLoggedIn, logout } = useAuth();

//   return (
//     <header className="header-container"> 
//       <div className="header-content"> 
//         <div className="header-right-global">
//           <span className="user-info">John Doe</span>
//           <img src="https://placehold.co/40x40/045093/ffffff?text=JD" className="profile-picture" onClick={logout}/>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;


import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
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
          <img
            src="https://placehold.co/40x40/045093/ffffff?text=JD"
            className="profile-picture"
            alt="Profile"
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
