const db = require('../db_connect');

const updatePatient = (userId, updatedData, callback) => {
    const query = `
        UPDATE patients
        SET ?
        WHERE user_id = ?`;

    db.query(query, [updatedData, userId], (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, result.affectedRows);
    });
};

module.exports = updatePatient;
