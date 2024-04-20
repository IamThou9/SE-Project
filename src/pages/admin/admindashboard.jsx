import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import '../admin/adminstyling/admindashboard.css'
import Sidebar from '../../components/Sidebar'
import helloImage from '../../images/hello.svg'
import Image from 'react-bootstrap/Image'

const AdminDashboard = () => {
  return (
    <>
      <Container fluid className='admin-dashboard'>
        <Row>
          <Col xs={2} className='sidebar'>
            <Sidebar role='admin' />
          </Col>
          <Col xs={10} className='content p-4'>
            <Row className="align-items-center">
            <Col xs={6}>
            <div className='wrapper d-flex'>
            <img src={helloImage} alt='hello'  />
              <div className='text-box'>
                <h1>Hello Admin!</h1>
                <p>What would you like to do today?</p>
              </div>
              </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AdminDashboard