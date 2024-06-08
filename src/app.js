const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const insertUser = require('../src/api/user_create');
const { loginUser } = require('../src/api/auth');
const getPatients = require("../src/api/view_patients");
const updatedData = require("../src/api/update_patient");
const deletePatientById = require('../src/api/delete_patient');
const db = require('../src/db_connect'); // Import db_connect module
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Session configuration
app.use(session({
    secret: '4R7u3S&^5kT#8@p9A!j2WqZ', // replace with a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set to true if using HTTPS
}));

// Function to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.status(403).send('Unauthorized access');
}

// Middleware to check specific roles
function checkRole(role) {
    return function (req, res, next) {
        if (req.session.user && req.session.user.role === role) {
            return next();
        }
        res.status(403).send('Unauthorized access');
    }
}

// Pages send
app.get('/login', (req, res) => {
    res.render(path.join(__dirname, '../view', 'login.ejs'));
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname, '../view', 'index.ejs'));
});

app.post('/create_user', (req, res) => {
    const customer = req.body;
    insertUser(customer, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json({ message: 'Customer created successfully', customer: result });
        }
    });
});

app.post('/login', loginUser);

app.get('/api/doctor/patients', isAuthenticated, checkRole('doctor'), (req, res) => {
    getPatients((err, patients) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(patients);
    });
});

app.delete('/api/doctor/patients/:userId/delete', isAuthenticated, checkRole('doctor'), (req, res) => {
    const userId = req.params.userId; // Get the userId from the request parameters
    deletePatientById(userId, (err, affectedRows) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (affectedRows === 0) {
            res.status(404).json({ error: 'User not found or not authorized to delete' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
});

app.put('/api/doctor/patients/:userId/update', isAuthenticated, checkRole('doctor'), (req, res) => {
    const userId = req.params.userId;
    const updatedData = req.body; // Assuming the updated data is sent in the request body

    // Call a function to update the patient's information
    updatePatient(userId, updatedData, (err, affectedRows) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (affectedRows === 0) {
            res.status(404).json({ error: 'User not found or not authorized to update' });
            return;
        }
        res.status(200).json({ message: 'User updated successfully' });
    });
});

// Protected routes
app.get('/patient', isAuthenticated, checkRole('patient'), (req, res) => {
    res.render(path.join(__dirname, '../view/patient', 'patient_dashboard.ejs'));
});

app.get('/doctor', isAuthenticated, checkRole('doctor'), (req, res) => {
    res.render(path.join(__dirname, '../view/doctor', 'doctor_dashboard.ejs'));
});
app.get('/doctor/patients_list', isAuthenticated, checkRole('doctor'), (req, res) => {
    res.render(path.join(__dirname, '../view/doctor', 'patients.ejs'));
});
app.get('/doctor/delete', isAuthenticated, checkRole('doctor'), (req, res) => {
    res.render(path.join(__dirname, '../view/doctor', 'delete.ejs'));
});
app.get('/doctor/update', isAuthenticated, checkRole('doctor'), (req, res) => {
    res.render(path.join(__dirname, '../view/doctor', 'update.ejs'));
});
app.get('/secretary', isAuthenticated, checkRole('secretary'), (req, res) => {
    res.render(path.join(__dirname, '../view/secretary', 'secretary_dashboard.ejs'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
