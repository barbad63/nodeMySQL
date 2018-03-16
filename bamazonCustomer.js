//load the packages needed for this project
var mysql = require('mysql');
const inquirer = require('inquirer');
var currencyFormatter = require('currency-formatter');

//setup global variables
var tab;
var purItem;

//set the connection details
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
	console.log("Connected to bamazon\n");
});


conn.query(
	"SELECT * FROM PRODUCTS",  function(err, res) {
		if(err) throw err;
		console.log('\x1b[36m%s\x1b[0m',"\nItem\tProduct Name\t\tDepartment\tPrice\tLeft In Stock");
		res.forEach(function(item, i, arr){
			if(arr[i].product_name.length > 14) {
				var tab = "\t";
			} else if (arr[i].product_name.length > 8 && arr[i].product_name.length <= 14) {
				var tab = "\t\t";
			} else {
				var tab = "\t\t\t"
			};
			console.log(arr[i].item_id + "\t" + arr[i].product_name + tab + arr[i].department_name + "\t" + arr[i].price + "\t\t" + arr[i].stock_quantity);
			
		});	

		// conn.end();
		getPurch();
});

function getPurch(){
	console.log("\n"); 
	inquirer.prompt([
	 
	  {
	      type: "input",
	      message: "What is the ID of the product you would like to buy?",
	      name: "itemID"
	  },
	  {
	  	type: "input",
	  	message: "How many would you like to order?",
	  	name: "quantity"
	  }
	]).then(function(inquirerResponse) {
		purItem = inquirerResponse.itemID;
		purQty = inquirerResponse.quantity;

		var sql = "SELECT * FROM PRODUCTS WHERE item_id = ?";
		var values = [purItem];
		conn.query(sql, values, function(err, res) {
			if(err) throw err;
				// stock_quantity
			var stkQty = res[0].stock_quantity;
			var price = currencyFormatter.unformat((res[0].price), { code: 'USD' })
			// Unit price times quantity
			var cost = price * purQty;
			var billed = currencyFormatter.format(cost, { code: 'USD' }); 
			if (stkQty >= purQty) {
				var qty = stkQty - purQty;
				var sql = "UPDATE PRODUCTS SET stock_quantity =? WHERE item_id = ?";
				var values = [qty, purItem];
				conn.query(sql, values, function(err, res) {
					if(err) throw err;
					console.log("\nTotal Cost: " + billed);
					conn.end();
					});		
			} else {
				console.log("\nInsufficient quantity!")
			}
		});		

				// getPurch();
	});
}

/*CREATE DATABASE bamazon;

update products
SET product_name = "coffee maker"
WHERE item_id = 6;

CREATE TABLE products (
item_id integer(11) auto_increment,
product_name varchar(255),
department_name varchar(70),
price varchar(30),
stock_quantity integer(11),
primary key(item_id)
);

insert into products (product_name, department_name, price, stock_quantity)
values("tennis shoes", "sporting goods", "$150.00", 15);

insert into products (product_name, department_name, price, stock_quantity)
values("tennis racquet", "sporting goods", "$220.00", 3);

insert into products (product_name, department_name, price, stock_quantity)
values("12 lb weight", "sporting goods", "$14.99", 50);

insert into products (product_name, department_name, price, stock_quantity)
values("winshield wipers", "automotive", "$6.57", 7);

insert into products (product_name, department_name, price, stock_quantity)
values("automotive battery", "automotive", "$122.00", 5);

insert into products (product_name, department_name, price, stock_quantity)
values("tires set of 4", "automotive", "$662.00", 3);

insert into products (product_name, department_name, price, stock_quantity)
values("cofee maker", "houseware", "$32.59", 4);

insert into products (product_name, department_name, price, stock_quantity)
values("set of steak knives", "houseware", "$59.95", 4);

insert into products (product_name, department_name, price, stock_quantity)
values("mouthwash", "personal care", "$5.46", 10);

insert into products (product_name, department_name, price, stock_quantity)
values("shampoo", "personal care", "$9.23", 2);

insert into products (product_name, department_name, price, stock_quantity)
values("toothpaste", "personal care", "$3.97", 15);

*/