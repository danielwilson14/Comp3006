import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    // Navigate to login page
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#f4f4f4',
        borderBottom: '1px solid #ccc',
      }}
    >
      <div>
        <Link to="/home" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/add-workout" style={{ marginRight: '10px' }}>Add Workout</Link>
        <Link to="/view-workouts" style={{ marginRight: '10px' }}>View Workouts</Link>
        <Link to="/workout-stats" style={{ marginRight: '10px' }}>Workout Stats</Link>
        <Link to="/update-profile" style={{ marginRight: '10px' }}>Update Profile</Link>
      </div>
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#ff4d4d',
          color: '#fff',
          border: 'none',
          padding: '8px 15px',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </nav>
  );
};

export default NavigationBar;
