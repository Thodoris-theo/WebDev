const db = require('../db_connect');

const cancelAppointment = (req, res) => {
    const { appointmentId } = req.body;

    const checkQuery = 'SELECT status FROM appointments WHERE id = ?';
    db.query(checkQuery, [appointmentId], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ success: false, message: 'Database error.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Appointment not found.' });
        }

        const status = results[0].status;
        if (status !== 'attended' && status !== 'completed') {
            const cancelQuery = 'UPDATE appointments SET status = ? WHERE id = ?';
            db.query(cancelQuery, ['cancelled', appointmentId], (err, result) => {
                if (err) {
                    console.error('Error cancelling appointment:', err);
                    return res.status(500).json({ success: false, message: 'Failed to cancel appointment.' });
                }

                res.json({ success: true, message: 'Appointment cancelled successfully.' });
            });
        } else {
            res.status(403).json({ success: false, message: 'Appointment cannot be cancelled as it has already been attended or completed.' });
        }
    });
};

module.exports = cancelAppointment;
