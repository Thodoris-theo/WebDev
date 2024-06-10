const db = require('../db_connect');


function addMedicalHistory(patientId, detectedHealthIssues, treatment) {
    const query = `
      INSERT INTO medical_history (patient_id, detected_health_issues, treatment)
      VALUES (?, ?, ?);
    `;
  
    connection.query(query, [patientId, detectedHealthIssues, treatment], (error, results, fields) => {
      if (error) {
        return console.error('Error inserting data: ' + error.message);
      }
      console.log('Inserted medical history record with ID:', results.insertId);
    });
  }
  