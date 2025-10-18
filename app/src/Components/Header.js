import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header-bar">
      <div className="header-left">
        <Link to="/" className="header-title">Home feed</Link>
      </div>

      <div className="header-center">
        <input
          type="text"
          className="search-input"
          placeholder="Search"
        />
      </div>

      <div className="header-right">
        <Link to="/collections" className="header-button">Saved</Link>
      </div>
    </header>
  );
}

export default Header;

