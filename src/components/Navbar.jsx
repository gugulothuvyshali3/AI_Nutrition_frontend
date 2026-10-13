import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/', label: 'Home', icon: '🏡' },
    { to: '/student', label: 'Student Details', icon: '👩‍🎓' },
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/foods', label: 'Foods', icon: '🥗' },
    { to: '/recommendations', label: 'Recommendations', icon: '✨' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="topbar">
      <NavLink to="/" className="brand" aria-label="AI Nutrition Advisor">
        <span className="brand-icon">🥗</span>
        <span>AI Nutrition <b>Advisor</b></span>
      </NavLink>

      <nav className="nav-links" aria-label="Main navigation">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end={link.to === '/'}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Authentication Buttons & User Badge */}
      <div className="nav-auth-section">
        {isAuthenticated ? (
          <div className="user-profile-menu">
            <div className="user-avatar-badge" title={user.email}>
              <span className="user-avatar-initial">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
              <span className="user-name-text">{user.name.split(' ')[0]}</span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-logout"
              title="Sign out of your account"
            >
              Log Out 🚪
            </button>
          </div>
        ) : (
          <div className="auth-nav-buttons">
            <Link to="/login" className="btn-nav-login">
              Log In
            </Link>
            <Link to="/register" className="btn-nav-register">
              Sign Up ✨
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
