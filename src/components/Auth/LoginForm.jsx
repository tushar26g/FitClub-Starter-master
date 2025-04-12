import React from 'react';
import './AuthModal.css';

const LoginForm = ({ switchToRegister }) => {
  return (
    <div className="form-container">
      <h2>Login</h2>
      <input type="text" placeholder="Email or Mobile" />
      <input type="password" placeholder="Password" />
      <button className="btn-orange">Login</button>
      <p className="forgot-password">Forgot Password?</p>
    </div>
  );
};

export default LoginForm;
