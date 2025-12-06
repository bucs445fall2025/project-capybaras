import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../Styles/Header.css';

function Header({ user, onCreateUser, onLogin, onLogout, onRefresh }) {
  const location = useLocation();
  const [showLoginModel, setShowLoginModel] = useState(false);
  const [loginName, setLoginName] = useState('');
  const [showSignupModel, setShowSignupModel] = useState(false);
  const [signupName, setSignupName] = useState('');

  const pageTitles = {
    '/': 'Home Feed',
    '/collections': 'Collections',
    '/my-recipes': 'Your Recipes',
    '/search': 'Search'
  };

  const headerButtons = {
    '/': { text: 'Saved', link: '/collections' },
    '/collections': { text: 'Home', link: '/' },
    '/recipe': { text: 'Home', link: '/' } 
  };

  const myRecipesButtons = {
    '/': { text: 'My Recipes', link: '/my-recipes' },
    '/my-recipes': { text: 'Home', link: '/'}
  };

  const searchHomeButtons = {
    '/search': { text: 'Home', link: '/'}
  };
  
  const pageTitle = pageTitles[location.pathname];
  let headerButton = headerButtons[location.pathname];
  if (location.pathname.startsWith('/recipe/')) {
    headerButton = { text: 'Home', link: '/' };
  }
  const myRecipesButton = myRecipesButtons[location.pathname];
  const searchHomeButton = searchHomeButtons[location.pathname];

  const handleHeaderButtonClick = (e) =>
  {
    const pageChange = headerButton?.link === '/' || myRecipesButton?.link === '/' || headerButton?.link === '/collections' || myRecipesButton?.link ==='/my-recipes';

    if(pageChange)
    {
      onRefresh && onRefresh()
    }
  };

  const openLogin = () =>
  {
    setLoginName('');
    setShowLoginModel(true);
  };

  const submitLogin = () =>
  {
    const v = (loginName || '').trim();
    if(!v)
    {
      return;
    }

    onLogin(v);
    setShowLoginModel(false);
  };

  const openSignup = () =>
  {
    setSignupName('');
    setShowSignupModel(true);
  };

  const submitSignup = () =>
  {
    const v = (signupName || '').trim();
    if(!v)
    {
      return;
    }

    onCreateUser(v);
    setShowSignupModel(false);
  }

  return (
    <>
      <header className="header-bar">
        <div className="header-left">
          {location.pathname === '/' ? (
            <button onClick={onRefresh} className="header-title" style={{background: 'none', border: 'none', cursor: 'pointer', padding: 0}}>{pageTitle}</button>
          ) : (
            <Link to="/" className="header-title">{pageTitle}</Link>
          )}
        </div>
        
        <div className="header-right">
          {headerButton && (
              <Link to={headerButton.link} className="header-button" onClick={handleHeaderButtonClick}>{headerButton.text}</Link>
          )}
          {
            myRecipesButton && (
              <Link to={myRecipesButton.link} className="header-button" onClick={handleHeaderButtonClick}>{myRecipesButton.text}</Link>
            ) 
          }
          {
            searchHomeButton && (
              <Link to={searchHomeButton.link} className="header-button" onClick={handleHeaderButtonClick}>{searchHomeButton.text}</Link>
            )
          }
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
                <button onClick={onLogout} className="header-button-flat">Logout</button>
                </div>
            ) : (
            <div style={{marginLeft:16, display: 'flex', gap: '8px'}}>
              <button onClick={openSignup} className="header-button">Sign Up</button>
              <button onClick={openLogin} className="header-button">Login</button>
            </div>
            )}
        </div>
      </header>

      {showLoginModel && (
        <div className='modal-backdrop'>
          <div className='modal'>
            <h3>Login</h3>
            <input autoFocus value={loginName} onChange={(e)=>setLoginName(e.target.value)} placeholder="Enter username"/>
            <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:12}}>
              <button onClick={()=>setShowLoginModel(false)}>Cancel</button>
              <button onClick={submitLogin}>Login</button>
            </div>
          </div>
        </div>
      )}

      {showSignupModel && (
        <div className='modal-backdrop'>
          <div className='modal'>
            <h3>Sign Up</h3>
            <input autoFocus value={signupName} onChange={(e)=>setSignupName(e.target.value)} placeholder="Enter username"/>
            <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:12}}>
              <button onClick={()=>setShowSignupModel(false)}>Cancel</button>
              <button onClick={submitSignup}>Sign Up</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;