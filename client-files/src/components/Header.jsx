import React from 'react';
import './Header.css';
import { useAuth } from "../context/AuthContext";


function Header() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <header className="header-container"> {/* Use the new wrapper class */}
      <div className="header-content"> {/* Inner content for flex distribution */}
        {/* The original image had "RAJASTHAN ROYALS ▼ Urmi Karla ▼" in the main content header area,
            but also "RAJASTHAN ROYALS ▼ Urmi Karla ▼" in the application's top header.
            I'm assuming the one *inside* the main content area is the one you want to align.
            If the image implies the top-right elements are *application-wide*, then they belong
            to a global header *above* the main content area, which is handled by grid-area.
            For now, let's keep the user/team selector in a global header.
            The "☰ Menu" is moved to the sidebar's bottom as per image.
        */}
        {/* The top-right elements */}
        <div className="header-right-global">
          <span className="user-info">John Doe</span>
          <img src="https://placehold.co/40x40/045093/ffffff?text=JD" className="profile-picture" onClick={logout}/>
        </div>
      </div>
    </header>
  );
}

export default Header;