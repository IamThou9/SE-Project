import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './studentstyling/student_login.css';

const StudentLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isAgreed, setIsAgreed] = useState(false); // New state variable
  const navigate = useNavigate();
  
  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAgreementChange = e => {
    setIsAgreed(e.target.checked);
  }

  const handleSubmit = async e => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8081/api/student/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Store the user information in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/student/student_dashboard');
      } else {
        // Handle invalid credentials
        console.log(data.message);
        alert('Incorrect email or password'); // Show an alert
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div
      className='std_container d-flex justify-content-center align-items-center'
      style={{ height: '100vh' }}
    >
      <div>
        <h3 className='std_heading'>Student Login</h3>
        <Form className='std_form' onSubmit={handleSubmit}>
          <Form.Group className='inputForm'>
            <Form.Label htmlFor='email'>Email</Form.Label>
            <Form.Control
              type='text'
              id='email'
              className='input'
              placeholder='Enter your email'
              required
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='inputForm'>
            <Form.Label htmlFor='password'>Password</Form.Label>
            <Form.Control
              type='password'
              id='password'
              className='input'
              placeholder='Enter your password'
              required
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='inputForm'>
            <Form.Check 
              type='checkbox' 
              checked={isAgreed} 
              onChange={handleAgreementChange}
              label="I agree to terms and services"
            />
          </Form.Group>
          <Button type='submit' className='login-button' disabled={!isAgreed}>
            Login
          </Button>
        </Form>
        <div className='d-flex justify-content-center form'>
          <Button
            variant='link'
            className='login-button'
            onClick={() => navigate('/student/studentsignup')}
          >
            Don't have an account? Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;