const db = require('../db_connect');

const searchAppointments = (req, res) => {
    const { startDate, endDate, healthIssue } = req.body;

    const sql = `
      SELECT ah.appointment_id, ah.record_id, ah.creation_date, ah.detected_health_issues, ah.treatment
      FROM appointment_history AS ah
      INNER JOIN appointments AS a ON ah.appointment_id = a.id
      WHERE a.date BETWEEN ? AND ?
        AND ah.detected_health_issues LIKE ?
    `;
    const params = [startDate, endDate, `%${healthIssue}%`];

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
};

module.exports = searchAppointments;
