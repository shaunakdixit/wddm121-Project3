import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase.js'; // Import auth directly from firebase.js
import Navbar from './Navbar';
import Footer from './Footer';

const useLoginForm = (callback) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    callback({ email, password });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
  };
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { email, setEmail, password, setPassword, handleSubmit } = useLoginForm(
    async ({ email, password }) => {
      if (!email.trim()) {
        alert('Please enter your email.');
        return;
      }
      if (!password.trim()) {
        alert('Please enter your password.');
        return;
      }

      try {
        await auth.signInWithEmailAndPassword(email, password);
        console.log('Login successful');
        alert('Login successful!');
        navigate('/');
      } catch (error) {
        console.error('Error logging in:', error.message);
      }
    }
  );

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control small-input"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="form-control small-input"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <p className="mt-3">
          Don't have an account? <Link to="/signup">Sign up here</Link>.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
