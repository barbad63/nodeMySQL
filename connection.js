var mysql = require('mysql');

//set the connection configuration
var conn = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: "root",
	password: "root",
	database: "bamazon"
});

//connect to the database
conn.connect(function(err){
	if(err) throw err;
	// console.log("Connected to bamazon\n");
});

// export the connection
module.exports = conn;