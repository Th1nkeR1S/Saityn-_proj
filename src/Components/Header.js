import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const handleMenuClick = () => {
    setIsMenuActive(false); // Close the menu when a menu item is clicked
  };

  return (
    <header>
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      <div className="site-title">
        <h1>Krepšinio komandų rungtynių forumas</h1>
      </div>
      <nav className={isMenuActive ? 'active' : ''}>
        <div className="hamburger" onClick={toggleMenu}>
          ☰
        </div>
        <ul className={isMenuActive ? 'show-menu' : ''}>
          <li><a href="/" onClick={handleMenuClick}>Home</a></li>
         
        </ul>
      </nav>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </header>
  );
};

export default Header;
