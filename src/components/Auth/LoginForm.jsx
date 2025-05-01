import React, { useState } from 'react';
import authService from '../../service/authService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ Named import
import './AuthModal.css';

const LoginForm = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = { identifier, password };
      const response = await authService.login(loginData);

      const { accessToken, refreshToken, owner } = response;

      // ✅ Store tokens and user
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('owner', JSON.stringify(owner));

      // ✅ Decode token and redirect based on role
      const decoded = jwtDecode(accessToken);
      const role = decoded.role;

      if (role === 'OWNER') {
        navigate('/dashboard');
      } else if (role === 'ADMIN') {
        navigate('/admin-dashboard'); // Add this route if needed
      } else {
        setErrorMessage('Unauthorized role');
      }
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
