function deleteMedicalHistory(recordId, callback) {
    const query = `
        DELETE FROM medical_history
        WHERE record_id = ?;
    `;

    db.query(query, [recordId], (error, results) => {
        if (error) {
            console.error('Error deleting data: ' + error.message);
            callback(error, null);
            return;
        }
        if (results.affectedRows === 0) {
            console.log('No rows deleted, possibly record not found');
        }
        callback(null, results.affectedRows);  // results.affectedRows will be 0 if no rows were deleted
    });
}
