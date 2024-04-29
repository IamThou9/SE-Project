const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const fs = require('fs')
const multer = require('multer')

if (!fs.existsSync('resumes')) {
  fs.mkdirSync('resumes')
}

const upload = multer({ dest: 'resumes/' })

const app = express()
app.use(cors())
app.use(express.json()) // Parse JSON request body
app.use(express.urlencoded({ extended: true }))
// Connect to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'fairjob'
});

//check successful connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to the database');
});

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
// server.js
app.post('/api/student/signup', upload.single('resume'), (req, res) => {
  const { firstname, lastname, email, password, gradyear, degree } = req.body;

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  // Save the resume file
  const pathName = email.split('@')[0]; // Split email at '@' instead of '.com'
  const resumePath = `resumes/${pathName}.pdf`;
  try {
    fs.renameSync(req.file.path, resumePath);
  } catch (err) {
    console.error('Error saving resume file:', err);
    return res.status(500).json({ success: false, message: 'Error saving resume file' });
  }

  const query = `INSERT INTO Student (password, email, Name, GradYear, major, Resume) VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [password, email, `${firstname} ${lastname}`, gradyear, degree, resumePath],
    (err, result) => {
      if (err) {
        console.error('Error inserting student:', err);
        return res.status(500).json({ success: false, message: 'Error registering student' });
      }

      res.json({ success: true, message: 'Student registered successfully' });
    }
  );
});
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
  const studentId = req.params.id;

  const query = `SELECT Name, email, GradYear, major, Resume FROM Student WHERE StdID = ?`;

  db.query(query, [studentId], (err, result) => {
    if (err) {
      console.error('Error fetching student data:', err);
      return res.status(500).json({ error: 'Error fetching student data' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = result[0];
    res.json({
      name: student.Name,
      email: student.email,
      gradYear: student.GradYear,
      major: student.major,
      resume: student.Resume,
    });
  });
});

app.put('/api/student/:id', upload.single('resume'), (req, res) => {
  const studentId = req.params.id;
  const { name, email, gradYear, major } = req.body;
  let resumePath = null;

  // Check if a new resume file was uploaded
  if (req.file) {
    const pathName = email.split('@')[0];
    resumePath = `resumes/${pathName}.pdf`;
    try {
      fs.renameSync(req.file.path, resumePath);
    } catch (err) {
      console.error('Error saving resume file:', err);
      return res.status(500).json({ error: 'Error saving resume file' });
    }
  } else {
    // If no new file was uploaded, fetch the existing resume path from the database
    const query = `SELECT Resume FROM Student WHERE StdID = ?`;
    db.query(query, [studentId], (err, result) => {
      if (err) {
        console.error('Error fetching student data:', err);
        return res.status(500).json({ error: 'Error fetching student data' });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      resumePath = result[0].Resume;

      // Update the student data with the existing resume path
      const updateQuery = `UPDATE Student SET Name = ?, email = ?, GradYear = ?, major = ?, Resume = ? WHERE StdID = ?`;
      db.query(
        updateQuery,
        [name, email, gradYear, major, resumePath || null, studentId],
        (err, result) => {
          if (err) {
            console.error('Error updating student data:', err);
            return res.status(500).json({ error: 'Error updating student data' });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Student not found' });
          }

          res.json({ message: 'Student data updated successfully' });
        }
      );
    });
  }
});

app.listen(8081, () => {
  console.log('Server is running on port 8081')
})