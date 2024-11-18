// components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Store JWT in local storage
          localStorage.setItem('token', data.token);
          // Redirect to home or product page
          navigate('/');
        } else {
          setError(data.message || 'Invalid login credentials');
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        setError('An error occurred. Please try again.');
      });
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <div className="register-prompt">
        <p>Don't have an account?</p>
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default Login;
