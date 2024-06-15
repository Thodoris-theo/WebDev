const express = require('express');
const router = express.Router();
const path = require('path');

// Middleware
const isAuthenticated = require('../src/middleware/isAuthenticated');
const checkRole = require('../src/middleware/checkRole');

// Site routes for rendering views
router.get('/login', (req, res) => {
    res.render(path.join(__dirname, '../view', 'login.ejs'));
});

router.get('/', (req, res) => {
    res.render(path.join(__dirname, '../view', 'index.ejs'));
});

router.get('/patient', isAuthenticated, checkRole('patient'), (req, res) => {
    res.render(path.join(__dirname, '../view/patient', 'patient_dashboard.ejs'));
});

router.get('/doctor', isAuthenticated, checkRole('doctor'), (req, res) => {
    res.render(path.join(__dirname, '../view/doctor', 'doctor_dashboard.ejs'));
});

router.get('/doctor/patients_list', isAuthenticated, checkRole('doctor'), (req, res) => {
    res.render(path.join(__dirname, '../view/doctor', 'patients.ejs'));
});

router.get('/doctor/delete', isAuthenticated, checkRole('doctor'), (req, res) => {
    res.render(path.join(__dirname, '../view/doctor', 'delete.ejs'));
});

router.get('/doctor/update', isAuthenticated, checkRole('doctor'), (req, res) => {
    res.render(path.join(__dirname, '../view/doctor', 'update.ejs'));
});

router.get('/secretary', isAuthenticated, checkRole('secretary'), (req, res) => {
    res.render(path.join(__dirname, '../view/secretary', 'secretary_dashboard.ejs'));
});

// Export the router
module.exports = router;
