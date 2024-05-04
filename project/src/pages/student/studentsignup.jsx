import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import './studentstyling/student_signup.css'

const StudentSignup = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    gradyear: '',
    degree: '',
    resume: null,
    password: ''
  })
  const [passwordError, setPasswordError] = useState('')

  const [isAgreed, setIsAgreed] = useState(false) // New state variable
  const handleAgreementChange = e => {
    setIsAgreed(e.target.checked)
  }
  const navigate = useNavigate()

  const validatePassword = password => {
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return re.test(password)
  }

  const handleChange = e => {
    if (e.target.id === 'password') {
      if (!validatePassword(e.target.value)) {
        setPasswordError(
          'Password must be at least 8 characters, include an uppercase letter, a number, and a special character'
        )
      } else {
        setPasswordError('')
      }
    }
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!passwordError) {
      try {
        const formDataToSend = new FormData()
        formDataToSend.append('firstname', formData.firstname)
        formDataToSend.append('lastname', formData.lastname)
        formDataToSend.append('email', formData.email)
        formDataToSend.append('gradyear', formData.gradyear)
        formDataToSend.append('degree', formData.degree)
        formDataToSend.append('resume', formData.resume) // Append the resume file
        formDataToSend.append('password', formData.password)
        console.log(formDataToSend)

        const response = await fetch(
          'http://localhost:8081/api/student/signup',
          {
            method: 'POST',
            body: formDataToSend
          }
        )

        const data = await response.json()
        if (data.success) {
          console.log(data.message)
          navigate('/student/studentlogin')
        } else {
          console.log(data.message)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  const handleFileChange = e => {
    setFormData({ ...formData, resume: e.target.files[0] }) // Update the resume file in the form data
  }

  return (
    <div
      className='container d-flex justify-content-center align-items-center'
      style={{ height: '100vh' }}
    >
      <div>
        <h3 className='heading'>Student Signup</h3>
        <Form className='std_form' onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className='inputForm'>
                <Form.Label htmlFor='firstname'>Firstname</Form.Label>
                <Form.Control
                  type='text'
                  id='firstname'
                  className='input'
                  placeholder='Enter your first name'
                  required
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='inputForm'>
                <Form.Label htmlFor='lastname'>Lastname</Form.Label>
                <Form.Control
                  type='text'
                  id='lastname'
                  className='input'
                  placeholder='Enter your Last name'
                  required
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
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
            </Col>
            <Col md={6}>
              <Form.Group className='inputForm'>
                <Form.Label htmlFor='gradyear'>Graduating Year</Form.Label>
                <Form.Control
                  type='number'
                  id='gradyear'
                  className='input'
                  placeholder='Graduating Year'
                  required
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className='inputForm'>
                <Form.Label htmlFor='degree'>Degree</Form.Label>
                <Form.Control
                  type='text'
                  id='degree'
                  className='input'
                  placeholder='Degree:(CS,AI,DS,CY)'
                  required
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className='inputForm'>
                <Form.Label htmlFor='resume'>Resume</Form.Label>
                <Form.Control
                  type='file'
                  id='resume'
                  className='input'
                  required
                  onChange={handleFileChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
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
                {passwordError && <div className='error'>{passwordError}</div>}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className='inputForm'>
                <Form.Check
                  type='checkbox'
                  id='agreement'
                  label='I agree to terms and services'
                  checked={isAgreed}
                  onChange={handleAgreementChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button type='submit' className='login-button' disabled={!isAgreed}>
            Sign Up
          </Button>
        </Form>
        <div className='d-flex justify-content-center form'>
          <Button
            variant='link'
            className='login-button'
            onClick={() => navigate('/student/studentlogin')}
          >
            Already have an account? Login
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StudentSignup
