import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav>
      <div className="nav-brand">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#e9d5ff' }}>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <Link to="/">Course Registration</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            {isAdmin ? (
              <>
                <Link to="/admin">Dashboard</Link>
                <Link to="/">All Courses</Link>
              </>
            ) : (
              <>
                <Link to="/my-courses">My Courses</Link>
              </>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                {user.name} {isAdmin && '(Admin)'}
              </span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Student Login</Link>
            <Link to="/admin-login" style={{ background: 'rgba(255,255,255,0.15)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
              Admin
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;