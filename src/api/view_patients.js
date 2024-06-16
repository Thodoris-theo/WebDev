const db = require('../db_connect');

const getPatients = (callback) => {
    const query = `
        SELECT u.id, u.username, u.email, u.firstName, u.lastName, u.identity_number, p.amka
        FROM users u
        LEFT JOIN patients p ON u.id = p.user_id
        WHERE u.role = 'patient'`;

    db.query(query, (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, result);
    });
};

module.exports = getPatients;
