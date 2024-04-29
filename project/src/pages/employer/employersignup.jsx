import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import './employeerstyling/employeer_login.css'

const EmployerSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    companyType: '',
    companyName: '' 
  })
  const navigate = useNavigate()

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    console.log(formData)

    try {
      const response = await fetch(
        'http://localhost:8081/api/employer/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      )
      const data = await response.json()
      if (data.success) {
        console.log(data.message)
        navigate('/employer/employerlogin')
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
        <h3 className='heading'>Employer Signup</h3>
        <Form className='form' onSubmit={handleSubmit}>
          <Form.Group className='inputForm'>
            <Form.Label htmlFor='username'>Full Name</Form.Label>
            <Form.Control
              type='text'
              id='username'
              className='input'
              placeholder='Enter your username'
              required
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='inputForm'>
            <Form.Label htmlFor='email'>Email</Form.Label>
            <Form.Control
              type='email'
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
            <Form.Label htmlFor='companyName'>Company Name</Form.Label>
            <Form.Control
              type='text'
              id='companyName'
              className='input'
              placeholder='Enter your company name'
              required
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className='inputForm'>
            <Form.Label htmlFor='companyType'>Company Type</Form.Label>
            <Form.Select id='companyType' required onChange={handleChange}>
              <option value=''>Select a company type</option>
              <option value='software company'>Software Company</option>
              <option value='IT consulting'>IT Consulting</option>
              <option value='tech startups'>Tech Startups</option>
              <option value='finance and banking'>Finance and Banking</option>
              <option value='healthcare technology'>
                Healthcare Technology
              </option>
              <option value='e-commerce and retail'>
                E-commerce and Retail
              </option>
              <option value='telecommunications'>Telecommunications</option>
              <option value='gaming and entertainment'>
                Gaming and Entertainment
              </option>
              <option value='manufacturing and engineering'>
                Manufacturing and Engineering
              </option>
              <option value='education technology'>Education Technology</option>
              <option value='government and public sector'>
                Government and Public Sector
              </option>
            </Form.Select>
          </Form.Group>
          <Form.Group className='inputForm'>
            <Form.Check type='checkbox'>
              <Form.Check.Input type='checkbox' isValid />
              <Form.Check.Label>I agree to terms and services</Form.Check.Label>
            </Form.Check>
          </Form.Group>
          <Button type='submit' className='login-button'>
            Sign Up
          </Button>
        </Form>
        <div className='d-flex justify-content-center form'>
          <Button
            variant='link'
            className='login-button'
            onClick={() => navigate('/employer/employerlogin')}
          >
            Already have an account? Login
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EmployerSignup
