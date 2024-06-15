

app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const user = req.session.user;
    res.render('patient_dash', { user });
});


app.get('/api/user', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    res.json(req.session.user);
});






// Cancel an appointment
function isDoctorAvailable(doctorId, appointmentDateTime, callback) {
    const sql = 'SELECT * FROM doctor_availability WHERE doctor_id = ? AND slot = ?';
    db.query(sql, [doctorId, appointmentDateTime], (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results.length > 0);
    });
}

app.post('/api/appointments', (req, res) => {
    const { patient, date, doctor } = req.body;

    const findDoctorSql = 'SELECT id FROM users WHERE username = ? AND role = "doctor"';
    db.query(findDoctorSql, [doctor], (err, doctorResults) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error finding doctor' });
            return;
        }

        if (doctorResults.length === 0) {
            res.status(404).json({ success: false, message: 'Doctor not found' });
            return;
        }

        const doctorId = doctorResults[0].id;

        isDoctorAvailable(doctorId, date, (err, available) => {
            if (err) {
                res.status(500).json({ success: false, message: 'Error checking availability' });
                return;
            }

            if (!available) {
                res.status(400).json({ success: false, message: 'Doctor not available at the selected time' });
                return;
            }

            const findPatientSql = 'SELECT id FROM users WHERE username = ? AND role = "patient"';
            db.query(findPatientSql, [patient], (err, patientResults) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'Error finding patient' });
                    return;
                }

                if (patientResults.length === 0) {
                    res.status(404).json({ success: false, message: 'Patient not found' });
                    return;
                }

                const patientId = patientResults[0].id;

                const insertAppointmentSql = 'INSERT INTO appointments (patient_id, date, reason, status) VALUES (?, ?, ?, ?)';
                db.query(insertAppointmentSql, [patientId, date, 'General Checkup', 'created'], (err, result) => {
                    if (err) {
                        res.status(500).json({ success: false, message: 'Error creating appointment' });
                        return;
                    }
                    res.json({ success: true });
                });
            });
        });
    });
});






//insert new apointment
// Endpoint to handle new appointment creation
app.post('/api/appointments', (req, res) => {
    const { patient, date, doctor } = req.body;

    const insertQuery = 'INSERT INTO appointments (patient, date, doctor) VALUES (?, ?, ?)';
    pool.query(insertQuery, [patient, date, doctor], (err, result) => {
        if (err) {
            console.error('Error inserting appointment:', err);
            return res.status(500).json({ success: false, error: 'Error inserting appointment' });
        }
        res.json({ success: true, appointmentId: result.insertId });
    });
});

//apointment_search
app.get('/api/appointments', (req, res) => {
    // Extract query parameters
    const { start_date, end_date, last_name, amka, status } = req.query;

    // Construct SQL query
    let sql = `SELECT appointments.id, appointments.date, patients.amka AS patient, appointments.status 
               FROM appointments 
               INNER JOIN patients ON appointments.patient_id = patients.user_id 
               WHERE 1`;

    const queryParams = [];

    // Add conditions based on provided parameters
    if (start_date && end_date) {
        sql += ` AND DATE(appointments.date) BETWEEN ? AND ?`;
        queryParams.push(start_date, end_date);
    }
    if (last_name) {
        sql += ` AND users.lastName LIKE ?`;
        queryParams.push(`%${last_name}%`);
    }
    if (amka) {
        sql += ` AND patients.amka = ?`;
        queryParams.push(amka);
    }
    if (status) {
        sql += ` AND appointments.status = ?`;
        queryParams.push(status);
    }

    // Execute the SQL query
    db.query(sql, queryParams, (err, results) => {
        if (err) {
            console.error('Error executing SQL:', err);
            res.status(500).json({ error: 'Error fetching appointments. Please try again later.' });
            return;
        }
        res.json(results);
    });
});



// Endpoint to handle search requests
app.post('/search', (req, res) => {
    const { startDate, endDate, healthIssue } = req.body;

    // Example filter based on mock data
    const filteredRecords = appointmentHistory.filter(record => {
        return (
            record.creation_date >= startDate &&
            record.creation_date <= endDate &&
            record.detected_health_issues === healthIssue
        );
    });

    res.json(filteredRecords);
});


// Route to delete an appointment
app.delete('/api/appointments/:id', async(req, res) => {
    try {
        const appointmentId = req.params.id;
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointment.status === 'attended' || appointment.status === 'completed') {
            return res.status(400).json({ success: false, message: 'Cannot delete attended or completed appointments' });
        }

        await Appointment.findByIdAndDelete(appointmentId);
        res.json({ success: true, message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ success: false, message: 'Error deleting appointment. Please try again.' });
    }
});

//this and patiend history


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

