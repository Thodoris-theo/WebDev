const db = require('../db_connect');

const updateAppointment = (req, res) => {
    const appointmentId = req.params.id;
    const { date, status } = req.body;

    const query = 'UPDATE appointments SET date = ?, status = ? WHERE id = ?';
    db.query(query, [date, status, appointmentId], (err, result) => {
        if (err) {
            console.error('Error updating appointment: ', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'No appointment found with the given ID.' });
        }

        res.json({ success: true, message: 'Appointment updated successfully' });
    });
};

module.exports = updateAppointment;
