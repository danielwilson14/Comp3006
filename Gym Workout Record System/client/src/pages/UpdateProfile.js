import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage(data.error || 'Failed to update profile.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred while updating the profile.');
    }
  };

  const handleDeleteAccount = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Confirmed');
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        if (response.ok) {
          console.log("Before calling localStorage.clear()");
          localStorage.clear();
          console.log("After calling localStorage.clear()");
          alert("Account deleted successfully.");
          navigate("/login");
        } else {
          alert('Failed to delete account.');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while deleting the account.');
      }
    }
    
  };

  return (
    <div>
      <h1>Update Profile</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      {message && <p>{message}</p>}
      <button
        onClick={handleDeleteAccount}
        style={{
          backgroundColor: 'red',
          color: 'white',
          marginTop: '20px',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Delete Account
      </button>
    </div>
  );
};

export default UpdateProfile;
