const db = require('../db_connect');

const updatePatient = (userId, updatedData, callback) => {
    const query = `
    UPDATE patients
    SET username = ?, email = ?, firstName = ?, lastName = ?, identity_number = ?
    WHERE user_id = ?`;
    db.query(query, [updatedData.username, updatedData.email, updatedData.firstName, updatedData.lastName, updatedData.identity_number, userId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            callback(err, null);
            return;
        }
        console.log("Affected rows:", result.affectedRows);
        callback(null, result.affectedRows);
    });
    
};

module.exports = updatePatient;
