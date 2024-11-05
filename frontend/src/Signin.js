// src/Signin.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// The Signin component
const Signin = ({ setToken }) => {
  // Declare the username and password state variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Get the navigate function from the useNavigate hook
  const navigate = useNavigate();

  // Handle the form submit event
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sign in the user
      const response = await axios.post('http://localhost:8000/signin', { username, password });
      // Store the token in local storage
      localStorage.setItem('token', response.data.token);
      // Set the token state variable
      setToken(response.data.token);
      navigate('/blogs'); // Redirect to the blogs page
    } catch (error) {
      console.error('There was an error signing in!', error);
    }
  };

  // Return the JSX that makes up the Signin component
  return (
    <div className="container mt-5">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;