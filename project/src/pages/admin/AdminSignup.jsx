import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './adminstyling/admin_login.css';

const AdminSignup = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    // Perform admin signup logic, send a request to the server
    try {
      const response = await fetch('http://localhost:8081/api/admin/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Signup successful, navigate to the admin login or dashboard
        navigate('/admin/adminlogin');
      } else {
        // Signup failed, display an error message
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <div>
        <h3 className="heading">Admin Signup</h3>
        <Form className="form" onSubmit={handleSubmit}>
          <Form.Group className="inputForm">
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control
              type="email"
              id="email"
              className="input"
              placeholder="Enter your email"
              required
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="inputForm">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              type="password"
              id="password"
              className="input"
              placeholder="Enter your password"
              required
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit" className="login-button">
            Sign Up
          </Button>
        </Form>
        <div className="d-flex justify-content-center form">
          <Button
            variant="link"
            className="login-button"
            onClick={() => navigate('/admin/adminlogin')}
          >
            Already have an account? Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;