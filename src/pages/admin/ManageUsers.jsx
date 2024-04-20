import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Table, Form, InputGroup, Button } from 'react-bootstrap';
import db from '../db'; // Import the database connection

// const ManageUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all');

//   useEffect(() => {
//     // Fetch users from the database
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await db.get('/users');
//       setUsers(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleFilterTypeChange = (e) => {
//     setFilterType(e.target.value);
//   };

//   const filteredUsers = users.filter((user) => {
//     if (filterType === 'all') {
//       return user.name.toLowerCase().includes(searchTerm.toLowerCase());
//     } else {
//       return user.role === filterType && user.name.toLowerCase().includes(searchTerm.toLowerCase());
//     }
//   });

//   const handleEdit = (userId) => {
//     // Logic to handle user edit
//     console.log('Editing user:', userId);
//   };

//   const handleDelete = (userId) => {
//     // Logic to handle user deletion
//     console.log('Deleting user:', userId);
//   };

//   return (
//     <>
//       <div>
//         <Sidebar role={'admin'} />
//       </div>
//       <div className="content">
//         <h1>Manage Users</h1>
//         <Form.Group controlId="filterType">
//           <Form.Label>Filter by:</Form.Label>
//           <Form.Control as="select" value={filterType} onChange={handleFilterTypeChange}>
//             <option value="all">All</option>
//             <option value="employer">Employer</option>
//             <option value="student">Student</option>
//           </Form.Control>
//         </Form.Group>
//         <InputGroup className="mb-3">
//           <Form.Control
//             placeholder="Search users"
//             aria-label="Search users"
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//           <InputGroup.Append>
//             <Button variant="outline-secondary">Search</Button>
//           </InputGroup.Append>
//         </InputGroup>
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>{user.role}</td>
//                 <td>
//                   <Button variant="primary" onClick={() => handleEdit(user.id)}>
//                     Edit
//                   </Button>
//                   <Button variant="danger" onClick={() => handleDelete(user.id)}>
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     </>
//   );
// };
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Fetch users from the database
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await db.get('/');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    if (filterType === 'all') {
      return user.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return user.role === filterType && user.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  const handleEdit = (userId) => {
    // Logic to handle user edit
    console.log('Editing user:', userId);
  };

  const handleDelete = (userId) => {
    // Logic to handle user deletion
    console.log('Deleting user:', userId);
  };

  return (
    <>
      <div>
        <Sidebar role={'admin'} />
      </div>
      <div className="content">
        <h1>Manage Users</h1>
        <Form.Group controlId="filterType">
          <Form.Label>Filter by:</Form.Label>
          <Form.Control as="select" value={filterType} onChange={handleFilterTypeChange}>
            <option value="all">All</option>
            <option value="employer">Employer</option>
            <option value="student">Student</option>
          </Form.Control>
        </Form.Group>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search users"
            aria-label="Search users"
            value={searchTerm}
            onChange={handleSearch}
          />
          <InputGroup.Append>
            <Button variant="outline-secondary">Search</Button>
          </InputGroup.Append>
        </InputGroup>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Button variant="primary" onClick={() => handleEdit(user.id)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default ManageUsers;