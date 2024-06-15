const db = require('../db_connect');

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

module.exports = isDoctorAvailable;
