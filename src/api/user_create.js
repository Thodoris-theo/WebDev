const bcrypt = require('bcrypt');
const db = require('../db_connect');

const saltRounds = 10; 

const insertUser = (user, callback) => {
  const { username, email, password, firstName, lastName, identity_number, role } = user;

  const checkQuery = `SELECT COUNT(*) AS count FROM users WHERE identity_number = ?`;

  db.query(checkQuery, [identity_number], (err, results) => {
    if (err) {
      return callback(new Error('Error checking for existing user: ' + err.message));
    }

    const count = results[0].count;

    if (count > 0) {
      return callback(new Error('Cannot create user: Identity number already exists'));
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        return callback(new Error('Error hashing password: ' + err.message));
      }
      
      const insertQuery = `
        INSERT INTO users (username, email, password, firstName, lastName, identity_number, role) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
      
      db.query(insertQuery, [username, email, hash, firstName, lastName, identity_number, role], (err, results) => {
        if (err) {
          return callback(new Error('Error creating user: ' + err.message));
        }
        callback(null, results);
      });
    });
  });
};

module.exports = insertUser;
