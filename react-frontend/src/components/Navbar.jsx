// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  if (!user) {
    // Logged out navbar
    return (
      <nav style={styles.nav}>
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <Link to="/login">Login</Link>
          <Link to="/register" style={styles.link}>Register</Link>
        </div>
      </nav>
    );
  }

  // Logged-in navbar
  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/calculator" style={styles.link}>Calculator</Link>
        <Link to="/income" style={styles.link}>Income</Link>
        <Link to="/expenses" style={styles.link}>Expenses</Link>
        <Link to="/debt" style={styles.link}>Debt</Link>
        <Link to="/savings" style={styles.link}>Savings</Link>
      </div>

      <div style={styles.right}>
        <div style={styles.dropdownWrapper}>
          <button onClick={toggleDropdown} style={styles.userBtn}>
            {user.email}
          </button>
          {showDropdown && (
            <div style={styles.dropdown}>
              <Link to="/settings" style={styles.dropdownItem}>Settings</Link>
              <button onClick={logout} style={styles.dropdownItem}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#f8f8f8',
    borderBottom: '1px solid #ddd',
    marginBottom: '20px',
    position: 'relative'
  },
  left: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  link: {
    marginLeft: '10px',
    textDecoration: 'none',
    color: '#333'
  },
  userBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#333'
  },
  dropdownWrapper: {
    position: 'relative'
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginTop: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    zIndex: 10,
    minWidth: '150px',
  },
  dropdownItem: {
    display: 'block',
    padding: '10px',
    textDecoration: 'none',
    color: '#333',
    width: '100%',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};
