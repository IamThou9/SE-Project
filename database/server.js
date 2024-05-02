const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const fs = require('fs')
const path = require('path') // Added path module for file manipulation
const multer = require('multer')

const app = express()
app.use(cors())
app.use(express.json()) // Parse JSON request body
app.use(express.urlencoded({ extended: true }))

// Create uploads and resumes directories if they don't exist
const resumesDir = path.join(__dirname, 'resumes')
const uploadsDir = path.join(__dirname, 'uploads')

fs.promises.mkdir(resumesDir, { recursive: true }).catch(err => {
  console.error('Error creating resumes directory:', err)
})

fs.promises.mkdir(uploadsDir, { recursive: true }).catch(err => {
  console.error('Error creating uploads directory:', err)
})

// Multer configuration for file uploads
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumesDir)
  },
  filename: function (req, file, cb) {
    let fileName;
    if (req.body.email) {
      fileName = `${req.body.email.split('@')[0]}.pdf`;
    } else {
      fileName = `${Date.now()}.pdf`;
    }
    cb(null, fileName)
  }
})

const uploadResume = multer({ storage: resumeStorage })

const questionsStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const employerId = req.params.employerId
    const jobTitle = req.body.jobTitle.replace(/\s+/g, '_')
    const fileName = `${employerId}_${jobTitle}_${Date.now()}.pdf`
    cb(null, fileName)
  }
})

const uploadQuestions = multer({ storage: questionsStorage })

// Connect to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'fairjob'
})

// Check successful connection
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err)
    return
  }
  console.log('Successfully connected to the database')
})

//---------------------------------------------------------LOGIN AND SIGNUP--------------------------------------------------------------
// Student Login
app.post('/api/student/login', (req, res) => {
  const { email, password } = req.body

  const query = `SELECT * FROM student WHERE email = '${email}' AND password = '${password}'`
  console.log(query)
  db.query(query, (err, result) => {
    if (err) throw err

    if (result.length > 0) {
      const user = result[0]
      res.json({
        success: true,
        user: {
          id: user.StdID,
          name: user.Name,
          email: user.email
        }
      })
    } else {
      res.json({ success: false, message: 'Invalid email or password' })
    }
  })
})

// Student Signup
app.post('/api/student/signup', uploadResume.single('resume'), (req, res) => {
  const { firstname, lastname, email, password, gradyear, degree } = req.body

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' })
  }

  // Save the resume file
  const pathName = email.split('@')[0] // Split email at '@' instead of '.com'
  const resumePath = `resumes/${pathName}.pdf`
  try {
    fs.renameSync(req.file.path, resumePath)
  } catch (err) {
    console.error('Error saving resume file:', err)
    return res
      .status(500)
      .json({ success: false, message: 'Error saving resume file' })
  }

  const query = `INSERT INTO Student (password, email, Name, GradYear, major, Resume) VALUES (?, ?, ?, ?, ?, ?)`

  db.query(
    query,
    [password, email, `${firstname} ${lastname}`, gradyear, degree, resumePath],
    (err, result) => {
      if (err) {
        console.error('Error inserting student:', err)
        return res
          .status(500)
          .json({ success: false, message: 'Error registering student' })
      }

      res.json({ success: true, message: 'Student registered successfully' })
    }
  )
})
// Employer login
app.post('/api/employer/login', (req, res) => {
  const { email, password } = req.body

  const query = `SELECT * FROM employeer WHERE email = '${email}' AND password = '${password}'`
  console.log(query)
  db.query(query, (err, result) => {
    if (err) throw err

    if (result.length > 0) {
      const user = result[0]
      res.json({
        success: true,
        user: {
          id: user.EmpID,
          name: user.Name,
          email: user.email
        }
      })
    } else {
      res.json({ success: false, message: 'Invalid email or password' })
    }
  })
})

//Employer Signup
app.post('/api/employer/signup', (req, res) => {
  const { username, email, password, companyType, companyName } = req.body

  const query = `INSERT INTO Employeer (Name, password, email, CompanyDesp, CompanyName) VALUES ('${username}', '${password}', '${email}', '${companyType}', '${companyName}')`

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error inserting employer:', err)
      res.json({ success: false, message: 'Error registering employer' })
    } else {
      res.json({ success: true, message: 'Employer registered successfully' })
    }
  })
})
//-----------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------Student Section---------------------------------------------------------------------
//-----------------------------------------------------Student Profile---------------------------------------------------------------------
// Get student profile
app.get('/api/student/:id', (req, res) => {
  const studentId = req.params.id

  const query = `SELECT Name, email, GradYear, major, Resume FROM Student WHERE StdID = ?`

  db.query(query, [studentId], (err, result) => {
    if (err) {
      console.error('Error fetching student data:', err)
      return res.status(500).json({ error: 'Error fetching student data' })
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Student not found' })
    }

    const student = result[0]
    res.json({
      name: student.Name,
      email: student.email,
      gradYear: student.GradYear,
      major: student.major,
      resume: student.Resume
    })
  })
})

app.put('/api/student/:id', uploadResume.single('resume'), (req, res) => {
  const studentId = req.params.id
  const { name, email, gradYear, major } = req.body
  let resumePath = null

  // Check if a new resume file was uploaded
  if (req.file) {
    const pathName = email.split('@')[0]
    resumePath = `resumes/${pathName}.pdf`
    try {
      fs.renameSync(req.file.path, resumePath)
    } catch (err) {
      console.error('Error saving resume file:', err)
      return res.status(500).json({ error: 'Error saving resume file' })
    }
  } else {
    // If no new file was uploaded, fetch the existing resume path from the database
    const query = `SELECT Resume FROM Student WHERE StdID = ?`
    db.query(query, [studentId], (err, result) => {
      if (err) {
        console.error('Error fetching student data:', err)
        return res.status(500).json({ error: 'Error fetching student data' })
      }

      if (result.length === 0) {
        return res.status(404).json({ error: 'Student not found' })
      }

      resumePath = result[0].Resume

      // Update the student data with the existing resume path
      const updateQuery = `UPDATE Student SET Name = ?, email = ?, GradYear = ?, major = ?, Resume = ? WHERE StdID = ?`
      db.query(
        updateQuery,
        [name, email, gradYear, major, resumePath || null, studentId],
        (err, result) => {
          if (err) {
            console.error('Error updating student data:', err)
            return res
              .status(500)
              .json({ error: 'Error updating student data' })
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' })
          }

          res.json({ message: 'Student data updated successfully' })
        }
      )
    })
  }
})
//-----------------------------------------------------Student Discussion Board---------------------------------------------------------------------
// Get all comments
// ... (existing code)

// Get all comments
app.get('/api/comments', (req, res) => {
  const query = `
    SELECT c.CommentID, c.Comment, s.Name
    FROM Comments c
    JOIN Student s ON c.Student_StdID = s.StdID
  `

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err)
      return res.status(500).json({ error: 'Error fetching comments' })
    }

    res.json(results)
  })
})

// Add a new comment
app.post('/api/comments', (req, res) => {
  const { comment, studentId } = req.body

  const query = 'INSERT INTO Comments (Comment, Student_StdID) VALUES (?, ?)'

  db.query(query, [comment, studentId], (err, result) => {
    if (err) {
      console.error('Error adding comment:', err)
      return res
        .status(500)
        .json({ success: false, message: 'Error adding comment' })
    }

    res.json({ success: true, message: 'Comment added successfully' })
  })
})

//-----------------------------------------------------Student Resources---------------------------------------------------------------------//
// Fetch all mock-up interviews
app.get('/api/mockups', (req, res) => {
  const query = 'SELECT mockID, jobTitle, questions FROM MockUp_Interview';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching mock-up interviews:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Always return an array, even if there are no results
    res.json(results || []);
  });
});
app.post('/api/application_stud', uploadResume.single('resume'), (req, res) => {
  const { jobId } = req.body;
  const studentId = req.headers.authorization;

  // Check if the student ID is valid
  const studentQuery = `SELECT * FROM Student WHERE StdID = ?`;
  db.query(studentQuery, [studentId], (err, studentResult) => {
    if (err) {
      console.error('Error fetching student data:', err);
      return res.status(500).json({ error: 'Error fetching student data' });
    }

    if (studentResult.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = studentResult[0];
    const studentEmail = student.email.split('@')[0];

    // Create the 'jobs' directory if it doesn't exist
    const jobsDir = path.join(__dirname, 'jobs');
    fs.promises.mkdir(jobsDir, { recursive: true }).catch(err => {
      console.error('Error creating jobs directory:', err);
    });

    //storing on the basis of student email and job id
    const candidateQuery = `INSERT INTO CandidateForm (Name, email, resume, ApplicationForm_ApplicationID, studentID) VALUES (?, ?, ?, ?, ?)`;
    const resumeFilename = `${studentEmail}_${jobId}.pdf`;
    const resumePath = path.join(jobsDir, resumeFilename);
    
    // First, insert a new record into the ApplicationForm table
    const applicationFormQuery = `INSERT INTO ApplicationForm (submissionDate, Jobs_OfferID) VALUES (NOW(), ?)`;
    
    db.query(applicationFormQuery, [jobId], (err, applicationFormResult) => {
      if (err) {
        console.error('Error inserting application form:', err);
        return res.status(500).json({ error: 'Error submitting application' });
      }
    
      const applicationFormId = applicationFormResult.insertId;
      const values = [student.Name, student.email, resumePath, applicationFormId, studentId];
    
      try {
        fs.renameSync(req.file.path, resumePath);
        db.query(candidateQuery, values, (err, candidateResult) => {
          if (err) {
            console.error('Error inserting candidate form:', err);
            return res.status(500).json({ error: 'Error submitting application' });
          }
    
          res.json({ success: true, message: 'Application submitted successfully' });
        });
      } catch (err) {
        console.error('Error saving resume file:', err);
        return res.status(500).json({ error: 'Error saving resume file' });
      }
    });
  });
});

//------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------Student JobListing--------------------------------------------------------------------//
// Fetch job listings
app.get('/api/jobs_stud', (req, res) => {
  const query = `
    SELECT j.OfferID, j.jobTitle, j.salary, j.StartDate, e.CompanyName, e.CompanyDesp
    FROM Jobs j
    JOIN Employeer e ON j.Employeer_EmpID = e.EmpID
    WHERE j.Status = 1;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching job listings:', err);
      return res.status(500).json({ error: 'Error fetching job listings' });
    }
    res.json(results);
  });
});

app.post('/api/application_stud', uploadResume.single('resume'), (req, res) => {
  const { jobId } = req.body;
  const studentId = req.headers.authorization;
  console.log(studentId)

  // Check if the student ID is valid
  const studentQuery = `SELECT * FROM Student WHERE StdID = ?`;
  db.query(studentQuery, [studentId], (err, studentResult) => {
    if (err) {
      console.error('Error fetching student data:', err);
      return res.status(500).json({ error: 'Error fetching student data' });
    }

    if (studentResult.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = studentResult[0];
    const studentEmail = student.email.split('@')[0];

    // Create the 'jobs' directory if it doesn't exist
    const jobsDir = path.join(__dirname, 'jobs');
    fs.promises.mkdir(jobsDir, { recursive: true }).catch(err => {
      console.error('Error creating jobs directory:', err);
    });

    //storing on the basis of student email and job id
    const candidateQuery = `INSERT INTO CandidateForm (CadID, Name, email, resume, ApplicationForm_ApplicationID) VALUES (?, ?, ?, ?, ?)`;
    const resumeFilename = `${studentEmail}_${jobId}.pdf`;
    const resumePath = path.join(jobsDir, resumeFilename);
    
    // First, insert a new record into the ApplicationForm table
    const applicationFormQuery = `INSERT INTO ApplicationForm (submissionDate, Jobs_OfferID) VALUES (NOW(), ?)`;
    
    db.query(applicationFormQuery, [jobId], (err, applicationFormResult) => {
      if (err) {
        console.error('Error inserting application form:', err);
        return res.status(500).json({ error: 'Error submitting application' });
      }
    
      const applicationFormId = applicationFormResult.insertId;
      const values = [studentId, student.Name, student.email, resumePath, applicationFormId];
    
      try {
        fs.renameSync(req.file.path, resumePath);
        db.query(candidateQuery, values, (err, candidateResult) => {
          if (err) {
            console.error('Error inserting candidate form:', err);
            return res.status(500).json({ error: 'Error submitting application' });
          }
    
          res.json({ success: true, message: 'Application submitted successfully' });
        });
      } catch (err) {
        console.error('Error saving resume file:', err);
        return res.status(500).json({ error: 'Error saving resume file' });
      }
    });
  });
});
//------------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------------------------------------------------------------------------------------//



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//---------------------------------------------------------------Kynat-----------------------------------------------------------------------
//----------------------------------------------ManageMockup-------------------------------------------------------------------------
// Set up multer for file uploads

// Fetch mock-up interviews for a specific employer
app.get('/api/employer/:employerId/mockups', (req, res) => {
  const employerId = req.params.employerId
  const query = `SELECT * FROM MockUp_Interview WHERE Employeer_EmpID = ?`

  db.query(query, [employerId], (err, results) => {
    if (err) {
      console.error('Error fetching mock-up interviews:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }

    res.json(results)
  })
})
// Add a new mock-up interview
app.post(
  '/api/employer/:employerId/mockups',
  uploadQuestions.single('questionsFile'),
  (req, res) => {
    const employerId = req.params.employerId
    const { jobTitle } = req.body
    const questionsFile = req.file

    if (!employerId) {
      console.error('employerId is undefined')
      return res.status(400).json({ error: 'Invalid employerId' })
    }

    if (!questionsFile) {
      console.error('No file uploaded')
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const query = `INSERT INTO MockUp_Interview (jobTitle, Employeer_EmpID, questions) VALUES (?, ?, ?)`
    const values = [jobTitle, employerId, req.file.path]

    db.query(query, values, (err, result) => {
      if (err) {
        console.error('Error adding mock-up interview:', err)
        return res.status(500).json({ error: 'Internal server error' })
      }

      const mockID = result.insertId
      const newFilePath = path.join(
        __dirname,
        'uploads',
        `${employerId}_${jobTitle.replace(/\s+/g, '_')}_${mockID}.pdf`
      )
      fs.renameSync(questionsFile.path, newFilePath)

      const updateQuery = `UPDATE MockUp_Interview SET questions = ? WHERE mockID = ?`
      db.query(updateQuery, [newFilePath, mockID], (err, result) => {
        if (err) {
          console.error('Error updating mock-up interview:', err)
          return res.status(500).json({ error: 'Internal server error' })
        }

        const newMockup = {
          mockID,
          jobTitle,
          questionsFile: newFilePath,
          Employeer_EmpID: employerId
        }

        res.json({ success: true, mockup: newMockup })
      })
    })
  }
)

app.listen(8081, () => {
  console.log('Server is running on port 8081')
})
