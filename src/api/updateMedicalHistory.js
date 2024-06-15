function updateMedicalHistory(recordId, detectedHealthIssues, treatment, callback) {
    const query = `
        UPDATE medical_history 
        SET detected_health_issues = ?, treatment = ?
        WHERE record_id = ?;
    `;

    db.query(query, [detectedHealthIssues, treatment, recordId], (error, results) => {
        if (error) {
            console.error('Error updating data: ' + error.message);
            callback(error, null);
            return;
        }
        if (results.affectedRows === 0) {
            console.log('No rows updated, possibly record not found');
        }
        callback(null, results.affectedRows);  
    });
}
