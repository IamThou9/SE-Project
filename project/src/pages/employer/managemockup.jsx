// import React, { useState, useEffect } from 'react';
// import Sidebar from '../../components/Sidebar';
// import './employeerstyling/employeer_card.css';
// import './employeerstyling/employeer_form.css';
// import { Button, Modal, Form } from 'react-bootstrap';
// import { FaPlus } from 'react-icons/fa';

// const ManageMockup = () => {
//   const [mockups, setMockups] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [newMockup, setNewMockup] = useState({ jobTitle: '', questionsFile: null });
//   const [noMockups, setNoMockups] = useState(false); // New state to track if there are no mock-up interviews

//   useEffect(() => {
//     const userInfo = JSON.parse(localStorage.getItem('user'));
//     if (userInfo) {
//       const employerId = userInfo.id;
//       fetch(`http://localhost:8081/api/employer/${employerId}/mockups`)
//         .then(response => response.json())
//         .then(data => {
//           if (data.length === 0) {
//             setNoMockups(true); // Set noMockups to true if there are no mock-up interviews
//           } else {
//             setMockups(data);
//             setNoMockups(false); // Set noMockups to false if there are mock-up interviews
//           }
//         })
//         .catch(error => console.error('Error fetching mock-up interviews:', error));
//     }
//   }, []);

//   const handleSubmit = async e => {
//     e.preventDefault();
//     const userInfo = JSON.parse(localStorage.getItem('user'));
//     if (userInfo) {
//       const formData = new FormData();
//       formData.append('jobTitle', newMockup.jobTitle);
//       formData.append('questionsFile', newMockup.questionsFile);

//       try {
//         const response = await fetch(`http://localhost:8081/api/employer/${userInfo.id}/mockups`, {
//           method: 'POST',
//           body: formData
//         });
//         const data = await response.json();
//         if (data.success) {
//           setMockups([...mockups, data.mockup]);
//           setNewMockup({ jobTitle: '', questionsFile: null });
//           setShowModal(false);
//           setNoMockups(false); // Set noMockups to false after adding a new mock-up interview
//         } else {
//           console.log(data.message);
//         }
//       } catch (error) {
//         console.error('Error adding mock-up interview:', error);
//       }
//     }
//   };

//   const handleFileChange = e => {
//     setNewMockup({ ...newMockup, questionsFile: e.target.files[0] });
//   };
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import './employeerstyling/employeer_card.css';
import './employeerstyling/employeer_form.css';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

const ManageMockup = () => {
  const [mockups, setMockups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMockup, setNewMockup] = useState({ jobTitle: '', questionsFile: null });
  const [noMockups, setNoMockups] = useState(false); // New state to track if there are no mock-up interviews

  useEffect(() => {
    fetchMockups();
  }, []);

  const fetchMockups = () => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      const employerId = userInfo.id;
      fetch(`http://localhost:8081/api/employer/${employerId}/mockups`)
        .then(response => response.json())
        .then(data => {
          if (data.length === 0) {
            setNoMockups(true); // Set noMockups to true if there are no mock-up interviews
          } else {
            setMockups(data);
            setNoMockups(false); // Set noMockups to false if there are mock-up interviews
          }
        })
        .catch(error => console.error('Error fetching mock-up interviews:', error));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (userInfo) {
      const formData = new FormData();
      formData.append('jobTitle', newMockup.jobTitle);
      formData.append('questionsFile', newMockup.questionsFile);

      try {
        const response = await fetch(`http://localhost:8081/api/employer/${userInfo.id}/mockups`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.success) {
          setMockups([...mockups, data.mockup]);
          setNewMockup({ jobTitle: '', questionsFile: null });
          setShowModal(false);
          setNoMockups(false); // Set noMockups to false after adding a new mock-up interview
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error('Error adding mock-up interview:', error);
      }
    }
  };

  const handleFileChange = e => {
    setNewMockup({ ...newMockup, questionsFile: e.target.files[0] });
  };

  return (
    <>
      <Sidebar role="employer" />
      <div className="container">
        <div className="d-flex justify-content-end mb-3">
          <Button variant="primary" onClick={() => setShowModal(true)} className="add-mockup-btn">
            <FaPlus /> Add Mock-up Interview
          </Button>
        </div>
        {noMockups ? (
          <p>No mock-up interviews available.</p>
        ) : (
          <div className="row">
            {mockups.map(mockup => (
              <div key={mockup.mockID} className="col-md-4 mb-4">
                <div className="card">
                  <div className="card-content">
                    <h2 className="card-title">{mockup.jobTitle}</h2>
                    <a href={`${mockup.questionsFile}`} target="_blank" rel="noopener noreferrer" className="btn">
                      View Questions
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for adding new mock-up interview */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static" keyboard={false}>
        <Modal.Body>
          <div className='mockup_container'>
            <h2 className='mockup_heading'>Add Mock-up Interview</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId='formJobTitle'>
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                  type="text"
                  value={newMockup.jobTitle}
                  onChange={e => setNewMockup({ ...newMockup, jobTitle: e.target.value })}
                  required
                  className='mockup_input'
                />
              </Form.Group>
              <Form.Group controlId='formQuestionsFile'>
                <Form.Label>Questions File</Form.Label>
                <Form.Control type="file" accept=".pdf" onChange={handleFileChange} required className='mockup_input' />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="primary" type="submit" className='mockup_button'>
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ManageMockup;