import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Styles/Header.css';

function Header({ user, onCreateUser, onLogin }) {
  const location = useLocation();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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

  const handleLoginClick = () =>
  {
    let username = prompt('Login username:');
    if(!username) {
      return;
    }

    username = username.trim();
    if(!username) {
      return;
    }

    onLogin(username);
  };

  return (
    <header className="header-bar">
      <div className="header-left">
        <Link to="/" className="header-title">{pageTitle}</Link>
      </div>

      {/* <div className="header-center">
        <input type="text" className="search-input" placeholder="Search" value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}/>
      </div> */}
      
      <div className="header-right">
        {headerButton && (
          <Link to={headerButton.link} className="header-button">
            {headerButton.text}
          </Link>
        )}
        {
          user ? (
            <div style=
            {
              {
                marginLeft: 16
              }
            }>
              <strong>
              {
                user.username
              }
              </strong>
              </div>
          ) : (
          <div style={{marginLeft:16, display: 'flex', gap: '8px'}}>
            <button onClick={onCreateUser} className="header-button">Sign Up</button>
            <button onClick={handleLoginClick} className="header-button">Login</button>
          </div>
          )}
      </div>
    </header>
  );
}

export default Header;