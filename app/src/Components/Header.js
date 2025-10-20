import React from 'react';
import '../Styles/Header.css';

function Header() {
  return (
    <header className="header-bar">
      <div className="header-left">
        <a href="/" className="header-title">Home feed</a>
      </div>
      <div className="header-center">
        <input type="text" className="search-input" placeholder="Search" />
      </div>
      <div className="header-right">
        <a href="/collections" className="header-button">Saved</a>
      </div>
    </header>
  );
}

export default Header;

