import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Styles/Header.css';

function Header({ searchTerm, setSearchTerm }) {
  const location = useLocation();

  const pageTitles = {
    '/': 'Home Feed',
    '/collections': 'Collections',
  };

  const headerButtons = {
    '/': { text: 'Saved', link: '/collections' },
    '/collections': { text: 'Home', link: '/' },
  };

  const pageTitle = pageTitles[location.pathname];
  const headerButton = headerButtons[location.pathname];

  return (
    <header className="header-bar">
      <div className="header-left">
        <Link to="/" className="header-title">{pageTitle}</Link>
      </div>

      <div className="header-center">
        <input type="text" className="search-input" placeholder="Search" value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>
      
      <div className="header-right">
        {headerButton && (
          <Link to={headerButton.link} className="header-button">
            {headerButton.text}
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;