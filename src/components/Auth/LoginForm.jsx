import React, { useState } from 'react';
import authService from '../../service/authService';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const LoginForm = ({ switchToRegister }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = { identifier, password };
      const response = await authService.login(loginData);

      localStorage.setItem('token', response.token);
      localStorage.setItem('owner', JSON.stringify(response.owner));

      navigate('/dashboard');
    } catch (error) {
      const message = error?.response?.data?.message || 'Login failed. Please try again.';
      setErrorMessage(message);
      console.error('Login failed:', message);
    }
  };

  return (
    <form className="form-container" onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email or Mobile"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="btn-orange" type="submit">Login</button>

      {errorMessage && <p className="error-text">{errorMessage}</p>}

      <p className="forgot-password">Forgot Password?</p>
    </form>
  );
};

export default LoginForm;
