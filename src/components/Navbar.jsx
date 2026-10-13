import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const links = [
    { to: '/', label: 'Home', icon: '🏡' },
    { to: '/student', label: 'Student Details', icon: '👩‍🎓' },
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/foods', label: 'Foods', icon: '🥗' },
    { to: '/recommendations', label: 'Recommendations', icon: '✨' },
  ];

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
    </header>
  );
}
