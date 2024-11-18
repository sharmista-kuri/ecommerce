// components/Registration.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';

const Registration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    // Basic validation checks
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(password)) {
      setError('Password must include uppercase, lowercase, number, and special character');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    setError('');
    return true;
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Mock database submission
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSuccess('Registration successful');
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        } else {
          setError(data.message || 'An error occurred during registration');
        }
      })
      .catch((error) => {
        console.error('Error registering user:', error);
        setError('An error occurred. Please try again.');
      });
  };

  return (
    <div className="registration">
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
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
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
        <div className="register-prompt">
          <p>registered?</p>
          <button onClick={handleLogin}>Login</button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
