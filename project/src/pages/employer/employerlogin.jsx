import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import './employeerstyling/employeer_login.css'

const EmployerLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const navigate = useNavigate()

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    console.log(formData)
    try {
      const response = await fetch('http://localhost:8081/api/employer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/employer/employerdashboard')
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div
      className='container d-flex justify-content-center align-items-center'
      style={{ height: '100vh' }}
    >
      <div>
        <h3 className='heading'>Employer Login</h3>
        <Form className='form' onSubmit={handleSubmit}>
          <Form.Group className='inputForm'>
            <Form.Label htmlFor='email'>Username</Form.Label>
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
            <Form.Check type='checkbox'>
              <Form.Check.Input type='checkbox' isValid />
              <Form.Check.Label>I agree to terms and services</Form.Check.Label>
            </Form.Check>
          </Form.Group>
          <Button type='submit' className='login-button'>
            Login
          </Button>
        </Form>
        <div className='d-flex justify-content-center form'>
          <Button
            variant='link'
            className='login-button'
            onClick={() => navigate('/employer/employersignup')}
          >
            Don't have an account? Sign Up
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EmployerLogin
