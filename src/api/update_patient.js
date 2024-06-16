const db = require('../db_connect');

const updatePatient = (identityNumber, updatedData, callback) => {
    const query = `
    UPDATE users
    SET username = ?, email = ?, firstName = ?, lastName = ?
    WHERE identity_number = ?`;
    db.query(query, [updatedData.username, updatedData.email, updatedData.firstName, updatedData.lastName, identityNumber], (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, result.affectedRows);
    });
};


module.exports = updatePatient;
