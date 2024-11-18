// components/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setName(data.name);
        setEmail(data.email);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        navigate('/login');
      });
  }, [navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    })
      .then((response) => response.json())
      .then((updatedUser) => {
        setUser(updatedUser);
        alert('Profile updated successfully');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        setError('An error occurred. Please try again.');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile">
      <h2>Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleUpdate}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
