import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthModal.css';

const AuthPopup = ({ show, defaultForm = 'login', closePopup }) => {
  const [activeForm, setActiveForm] = useState(defaultForm);

  useEffect(() => {
    if (show) {
      setActiveForm(defaultForm); 
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [show]);

  if (!show) return null;

  const handleSwitch = (form) => {
    setActiveForm(form);
  };

  const handleOverlayClick = () => {
    if (closePopup) closePopup();
  };

  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="auth-popup-overlay" onClick={handleOverlayClick}>
      <div className="auth-popup large" onClick={handlePopupClick}>
        <button className="auth-close-btn" onClick={closePopup}>×</button>

        {/* Form Section */}
        <div className="auth-form-container">
          {activeForm === 'login' ? (
            <LoginForm onSwitch={() => handleSwitch('register')} />
          ) : (
            <RegisterForm onSwitch={() => handleSwitch('login')} />
          )}
        </div>

        {/* Switch Text Section */}
        <div className="auth-switch-container">
          {activeForm === 'login' ? (
            <>
              <h3>Don't have an account?</h3>
              <button className="switch-btn" onClick={() => handleSwitch('register')}>
                Register
              </button>
            </>
          ) : (
            <>
              <h3>Already have an account?</h3>
              <button className="switch-btn" onClick={() => handleSwitch('login')}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPopup;
