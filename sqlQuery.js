var mysql = require('mysql');

// Create a generic sql query function used by 
// all areas of the project
function sqlPromise (connection, sql, values) {
    // Create a promise for the query to provide a pass/fail async response
    return new Promise(function (resolve, reject) {
        // Put your logic inside the callback
        connection.query(sql, values || [], function (err, res) {
            if (err) {
                reject(err); // Reject on error
            } else {
                resolve(res);
            }
        });
    })
};

module.exports = sqlPromise;