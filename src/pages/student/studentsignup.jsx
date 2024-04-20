import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './studentstyling/student_signup.css';

const StudentSignup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    // Perform student signup logic, save new student user to the database
    // If successful, navigate to the student dashboard
    navigate('/student/student_dashboard');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div>
        <h3 className="heading">Student Signup</h3>
        <Form className="form" onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="inputForm">
                <Form.Label htmlFor="firstname">Firstname</Form.Label>
                <Form.Control type="text" id="firstname" className="input" placeholder="Enter your first name" required onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="inputForm">
                <Form.Label htmlFor="lastname">Lastname</Form.Label>
                <Form.Control type="text" id="lastname" className="input" placeholder="Enter your Last name" required onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="inputForm">
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control type="email" id="email" className="input" placeholder="Enter your email" required onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="inputForm">
                <Form.Label htmlFor="semester">Current Semester</Form.Label>
                <Form.Control type="number" id="semester" className="input" placeholder="Semester ?" required onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="inputForm">
                <Form.Label htmlFor="gpa">GPA</Form.Label>
                <Form.Control type="number" id="gpa" className="input" placeholder="GPA" required onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="inputForm">
                <Form.Label htmlFor="degree">Degree</Form.Label>
                <Form.Control type="text" id="degree" className="input" placeholder="Degree:(CS,AI,DS,CY)" required onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="inputForm">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control type="password" id="password" className="input" placeholder="Enter your password" required onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="inputForm">
                <Form.Check type="checkbox">
                  <Form.Check.Input type="checkbox" isValid />
                  <Form.Check.Label>I agree to terms and services</Form.Check.Label>
                </Form.Check>
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" className="login-button">
            Sign Up
          </Button>
        </Form>
        <div className="d-flex justify-content-center form">
          <Button variant="link" className="login-button" onClick={() => navigate('/student/studentlogin')}>
            Already have an account? Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;