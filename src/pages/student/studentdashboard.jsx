import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import '../student/studentstyling/studentdashboard.css';
import Sidebar from '../../components/Sidebar';
import welcomeImage from '../../images/hello.svg';

const StudentDashboard = () => {
  return (
    <>
      <Container fluid className='student-dashboard'>
        <Row>
          <Col xs={2} className='sidebar'>
            <Sidebar role='student' />
          </Col>
          <Col xs={10} className='content p-4'>
            <Row className="align-items-center">
              <Col xs={6}>
                <div className='wrapper d-flex'>
                  <img src={welcomeImage} alt='welcome' />
                  <div className='text-box'>
                    <h1>Welcome, Student!</h1>
                    <p>What would you like to do today?</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default StudentDashboard;