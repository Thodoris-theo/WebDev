const db = require('../db_connect');

const createAppointment = (req, res) => {
    const { patient, date, doctor } = req.body;

    const getDoctorIdQuery = 'SELECT doctors.user_id FROM doctors JOIN users ON doctors.user_id = users.id WHERE users.username = ?';
    db.query(getDoctorIdQuery, [doctor], (err, doctorResults) => {
        if (err) {
            console.error('Error fetching doctor ID: ', err);
            return res.status(500).json({ success: false, message: 'Database error while fetching doctor ID.' });
        }
        if (doctorResults.length === 0) {
            console.warn('Doctor not found: ', doctor);
            return res.status(404).json({ success: false, message: 'Doctor not found.' });
        }

        const doctorId = doctorResults[0].user_id;

        const checkAvailabilityQuery = 'SELECT * FROM doctor_availability WHERE doctor_id = ? AND slot = ?';
        db.query(checkAvailabilityQuery, [doctorId, date], (err, availabilityResults) => {
            if (err) {
                console.error('Error checking doctor availability: ', err);
                return res.status(500).json({ success: false, message: 'Database error while checking doctor availability.' });
            }
            if (availabilityResults.length === 0) {
                console.warn('Doctor not available at this time: ', date);
                return res.status(400).json({ success: false, message: 'Doctor not available at this time.' });
            }

            const getPatientIdQuery = 'SELECT id FROM users WHERE username = ?';
            db.query(getPatientIdQuery, [patient], (err, patientResults) => {
                if (err) {
                    console.error('Error fetching patient ID: ', err);
                    return res.status(500).json({ success: false, message: 'Database error while fetching patient ID.' });
                }
                if (patientResults.length === 0) {
                    console.warn('Patient not found: ', patient);
                    return res.status(404).json({ success: false, message: 'Patient not found.' });
                }

                const patientId = patientResults[0].id;

                const insertAppointmentQuery = 'INSERT INTO appointments (patient_id, date, reason, status) VALUES (?, ?, ?, ?)';
                db.query(insertAppointmentQuery, [patientId, date, 'Regular check-up', 'created'], (err, insertResults) => {
                    if (err) {
                        console.error('Error inserting appointment: ', err);
                        return res.status(500).json({ success: false, message: 'Database error while inserting appointment.' });
                    }

                    res.json({ success: true, message: 'Appointment created successfully.' });
                });
            });
        });
    });
};

module.exports = createAppointment;
