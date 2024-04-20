import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './employeerstyling/employeer_login.css';

const EmployerSignup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    // Perform employer signup logic, save new employer user to the database
    // If successful, navigate to the employer dashboard
    navigate('/employer/employerdashboard');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div>
        <h3 className="heading">Employer Signup</h3>
        <Form className="form" onSubmit={handleSubmit}>
          <Form.Group className="inputForm">
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Control type="text" id="username" className="input" placeholder="Enter your username" required onChange={handleChange} />
          </Form.Group>
          <Form.Group className="inputForm">
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Control type="email" id="email" className="input" placeholder="Enter your email" required onChange={handleChange} />
          </Form.Group>
          <Form.Group className="inputForm">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control type="password" id="password" className="input" placeholder="Enter your password" required onChange={handleChange} />
          </Form.Group>
          <Form.Group className="inputForm">
            <Form.Check type="checkbox">
              <Form.Check.Input type="checkbox" isValid />
              <Form.Check.Label>I agree to terms and services</Form.Check.Label>
            </Form.Check>
          </Form.Group>
          <Button type="submit" className="login-button">
            Sign Up
          </Button>
        </Form>
        <div className="d-flex justify-content-center form">
          <Button variant="link" className="login-button" onClick={() => navigate('/employer/employerlogin')}>
            Already have an account? Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignup;