import React, { useState } from 'react';
import authService from '../../service/authService';
import './AuthModal.css';

const ForgotPasswordForm = ({ onSwitch }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.forgotPassword({ mobileNumber });
      setStatusMessage(response.message || 'Reset password link sent to your registered email.');
      setErrorMessage('');
    } catch (error) {
      const message = error?.response?.data?.message || 'Error sending reset link.';
      setErrorMessage(message);
      setStatusMessage('');
    }
  };

  return (
    <form className="form-container" onSubmit={handleForgotPassword}>
      <h2>Forgot Password</h2>
      <input
        type="text"
        placeholder="Registered Mobile Number"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        required
      />
      <button className="btn-orange" type="submit">Send Reset Link</button>

      {statusMessage && <p className="success-text">{statusMessage}</p>}
      {errorMessage && <p className="error-text">{errorMessage}</p>}

      <p className="back-to-login" onClick={() => onSwitch('login')}>Back to Login</p>
    </form>
  );
};

export default ForgotPasswordForm;
