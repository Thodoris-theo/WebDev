const db = require('../db_connect');

const updatePatientInfo = (userId, updatedData, callback) => {

    const fieldsToUpdate = Object.keys(updatedData).map(key => `${key} = ?`).join(', ');
    const sqlValues = [...Object.values(updatedData), userId];

    const sqlQuery = `UPDATE users SET ${fieldsToUpdate} WHERE id = ?`;

    db.query(sqlQuery, sqlValues, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result.affectedRows);
    });
};

module.exports = updatePatientInfo;
