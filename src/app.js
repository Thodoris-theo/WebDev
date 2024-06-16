const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const insertUser = require('../src/api/user_create');
const { loginUser } = require('../src/api/auth');
const getPatients = require("../src/api/view_patients");
const updatePatient = require("../src/api/update_patient");
const deletePatientById = require('../src/api/delete_patient');
const db = require('../src/db_connect'); // Import db_connect module
const app = express();
const port = 3001;


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
    return function(req, res, next) {
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



app.get('/user', (req, res) => {
    res.render(path.join(__dirname, '../view/user', 'user.ejs'));
});

app.get('/delete', (req, res) => {
    res.render(path.join(__dirname, '../view/functions', 'delete.ejs'));
});
app.get('/patient_dashboard', (req, res) => {
    res.render(path.join(__dirname, '../view/patient', 'patient_dashboard.ejs'));
});

app.get('/secretary_dashboard', (req, res) => {
    res.render(path.join(__dirname, '../view/secretary', 'secretary_dashboard.ejs'));
});

app.get('/index', (req, res) => {
    res.render(path.join(__dirname, '../view', 'index.ejs'));
});

app.get('/', (req, res) => {
    res.render(path.join(__dirname, '../view', 'main_page.ejs'));
});

app.get('/patients', (req, res) => {
    res.render(path.join(__dirname, '../view/functions', 'patients.ejs'));
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

app.get('/api/doctor/patients', isAuthenticated, (req, res) => {
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


app.put('/api/doctor/patients/update/:identityNumber', isAuthenticated, (req, res) => {
    const identityNumber = req.params.identityNumber;
    const updatedData = req.body;

    updatePatient(identityNumber, updatedData, (err, affectedRows) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (affectedRows === 0) {
            res.status(404).json({ error: 'Patient not found or not authorized to update' });
            return;
        }
        res.status(200).json({ message: 'Patient updated successfully' });
    });
});

app.get('/api/doctor/patients/:identityNumber/medical-history', isAuthenticated, (req, res) => {
    const identityNumber = req.params.identityNumber;

    getMedicalHistoryByIdentity(identityNumber, (err, history) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (!history) {
            res.status(404).json({ message: 'No medical history found' });
            return;
        }
        res.json(history);
    });
});

function getMedicalHistoryByIdentity(identityNumber, callback) {
    const query = 'SELECT * FROM medical_history WHERE patient_id IN (SELECT id FROM users WHERE identity_number = ?)';
    db.query(query, [identityNumber], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}


// Protected routes
app.get('/patient', isAuthenticated, checkRole('patient'), (req, res) => {
    res.render(path.join(__dirname, '../view/patient', 'patient_dashboard.ejs'));
});

app.get('/doctor', isAuthenticated, checkRole('doctor'), (req, res) => {
    res.render(path.join(__dirname, '../view/doctor', 'doctor_dashboard.ejs'));
});
app.get('/doctor/patients_list', isAuthenticated, (req, res) => {
    res.render(path.join(__dirname, '../view/functions', 'patients.ejs'));
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