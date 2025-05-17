import React, { useState } from 'react';
import authService from '../../service/authService';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './AuthModal.css';

const LoginForm = ({ onSwitch }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // ✅ new state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ disable button
    setErrorMessage('');

    try {
      const loginData = { identifier, password };
      const response = await authService.login(loginData);

      const { accessToken, refreshToken, owner } = response;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('owner', JSON.stringify(owner));

      const decoded = jwtDecode(accessToken);
      const role = decoded.role;

      if (role === 'OWNER') {
        navigate('/dashboard');
      } else if (role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        setErrorMessage('Unauthorized role');
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Login failed. Please try again.';
      setErrorMessage(message);
      console.error('Login failed:', message);
    } finally {
      setLoading(false); // ✅ re-enable button
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
      <button className="btn-orange" type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {errorMessage && <p className="error-text">{errorMessage}</p>}
      <p className="forgot-password" onClick={() => onSwitch('forgot')}>
        Forgot Password?
      </p>
    </form>
  );
};

export default LoginForm;
