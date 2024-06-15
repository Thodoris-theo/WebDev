const express = require('express');
const router = express.Router();

// Middleware
const isAuthenticated = require('../path/to/isAuthenticated');
const checkRole = require('../path/to/checkRole');

// API dependencies
const getPatients = require("../api/view_patients");
const deletePatientById = require('../api/delete_patient');
const updatePatient = require('../api/update_patient');
const addMedicalHistory = require('../api/add_medical_history');
const updateMedicalHistory = require('../api/update_medical_history');
const deleteMedicalHistory = require('../api/delete_medical_history');
const getMedicalHistoryByPatient = require('../api/get_medical_history');

// API routes
// Route for getting patients accessible by a doctor
router.get('/doctor/patients', isAuthenticated, checkRole('doctor'), (req, res) => {
    getPatients((err, patients) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(patients);
    });
});

// Route for adding medical history accessible by a doctor
router.post('/doctor/patients/:patientId/addMedicalHistory', isAuthenticated, checkRole('doctor'), (req, res) => {
    const patientId = req.params.patientId;
    const { detectedHealthIssues, treatment } = req.body;
    
    addMedicalHistory(patientId, detectedHealthIssues, treatment, (err, insertId) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error', message: err.message });
            return;
        }
        res.status(201).json({ message: 'Medical history record added successfully', recordId: insertId });
    });
});

// Route for updating a patient's medical history accessible by a doctor
router.put('/doctor/medicalHistory/:recordId/update', isAuthenticated, checkRole('doctor'), (req, res) => {
    const recordId = req.params.recordId;
    const { detectedHealthIssues, treatment } = req.body;

    updateMedicalHistory(recordId, detectedHealthIssues, treatment, (err, affectedRows) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error', message: err.message });
            return;
        }
        if (affectedRows === 0) {
            res.status(404).json({ error: 'Medical history record not found or not authorized to update' });
            return;
        }
        res.status(200).json({ message: 'Medical history record updated successfully' });
    });
});

// Route for deleting a patient's medical history accessible by a doctor
router.delete('/doctor/medicalHistory/:recordId/delete', isAuthenticated, checkRole('doctor'), (req, res) => {
    const recordId = req.params.recordId;

    deleteMedicalHistory(recordId, (err, affectedRows) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error', message: err.message });
            return;
        }
        if (affectedRows === 0) {
            res.status(404).json({ error: 'Medical history record not found or not authorized to delete' });
            return;
        }
        res.status(200).json({ message: 'Medical history record deleted successfully' });
    });
});

// Export the router
module.exports = router;
