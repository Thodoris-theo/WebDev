const db = require('../db_connect');

const deletePatientById = (userId, callback) => {
    const deleteQuery = `
        DELETE FROM users
        WHERE id = ?`;

    db.query(deleteQuery, [userId], (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }
        
        callback(null, result);
    });
};

module.exports = deletePatientById;
