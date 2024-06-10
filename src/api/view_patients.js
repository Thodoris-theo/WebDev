const db = require('../db_connect');

const getPatients = (callback) => {
    const query = `
        SELECT email, username, firstName, lastName, identity_number
        FROM users
        WHERE role = 'patient'`;

    db.query(query, (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, result);
    });
};

module.exports = getPatients;
