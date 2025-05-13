import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AuthModal.css'; // Reuse your styling
import './ResetPasswordPage.css'; // Reuse your styling
const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setErrorMessage('Invalid or missing token.');
    }
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
        token,
        newPassword,
      });

      setStatusMessage(response.data.message || 'Password reset successful!');
      setErrorMessage('');

      setTimeout(() => {
        navigate('/'); // Redirect to login after success
      }, 2000);
    } catch (error) {
      const message = error?.response?.data?.message || 'Reset failed.';
      setErrorMessage(message);
      setStatusMessage('');
    }
  };

  return (
    <div className="auth-popup-overlay2">
      <div className="auth-popup2" style={{ maxWidth: '400px' }}>
        <form className="form-container" onSubmit={handleResetPassword}>
          <h2>Reset Password</h2>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className="btn-orange" type="submit">
            Reset Password
          </button>
          {statusMessage && <p className="success-text">{statusMessage}</p>}
          {errorMessage && <p className="error-text">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
