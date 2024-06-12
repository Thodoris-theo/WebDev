function getMedicalHistoryByPatient(patientId, callback) {
    const query = `SELECT * FROM medical_history WHERE patient_id = ?;`;

    db.query(query, [patientId], (error, results) => {
        if (error) {
            console.error('Error fetching medical history: ' + error.message);
            callback(error, null);
            return;
        }
        callback(null, results);
    });
}
