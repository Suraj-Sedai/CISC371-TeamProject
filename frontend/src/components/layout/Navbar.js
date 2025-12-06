import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav>
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span>💪</span>
          <span>FitTracker</span>
        </Link>

        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <span className="nav-user">
                Hi, {user?.first_name || user?.username}
              </span>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register">
                <button className="btn btn-white btn-sm">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;