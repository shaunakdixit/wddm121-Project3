import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase.js'; // Import auth from firebase.js
import Navbar from './Navbar';
import Footer from './Footer';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      console.log('Signup successful:', userCredential.user);

      alert('Sign up successful!');

      // Redirect to login page after successful signup
      navigate('/login'); // Navigate to the login page
    } catch (error) {
      setError(error.message); // Update error state with Firebase error message
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control"
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
              className="form-control"
              id="password"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </form>
        <p className="mt-3">
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage;
