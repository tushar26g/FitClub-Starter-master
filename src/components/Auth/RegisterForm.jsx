import React, { useState } from 'react';
import authService from '../../service/authService'; // make sure path is correct
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const RegisterForm = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    mobile_number: '',
    gym_name: '',
    address: '',
    selected_plan: '',
    profile_picture: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        dataToSend.append(key, formData[key]);
      });

      const response = await authService.registerOwner(dataToSend);
      localStorage.setItem('token', response.token);
      localStorage.setItem('owner', JSON.stringify(response.owner));

      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input type="text" name="full_name" placeholder="Full Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <input type="text" name="mobile_number" placeholder="Mobile Number" onChange={handleChange} required />
      <input type="text" name="gym_name" placeholder="Gym Name" onChange={handleChange} required />
      <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
      <input type="file" name="profile_picture" onChange={handleChange} />
      <input type="text" name="selected_plan" placeholder="Selected Plan" onChange={handleChange} required />
      <button className="btn-orange" type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
