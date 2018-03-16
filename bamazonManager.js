var mysql = require('mysql');
var sqlPromise = require("./sqlQuery.js")
var conn = require("./connection.js");
const inquirer = require('inquirer');
var sql;
var values;
var stckQty;
var stckItem;

managerView();

function managerView() {

    console.log("\n"); 
    inquirer.prompt([
      {
          type: 'list',
          message: 'Manager View',
          choices: ['View_Products_for_Sale', 'View_Low_Inventory', 'Add_to_Inventory', 'Add_New_Product', 'exit'],
          name: 'todo'
      }
    ]).then(function(inquirerResponse) {
        // Check the user response
        switch(inquirerResponse.todo) {
            case 'View_Products_for_Sale':
                sql = "SELECT * FROM PRODUCTS";
                values = "";
                perfQuery(sql, values);
                break;
            case 'View_Low_Inventory':
                sql = "SELECT * FROM PRODUCTS WHERE stock_quantity < ?";
                values = "5";
                perfQuery(sql, values);
                break;
            case 'Add_to_Inventory':
                inquirer.prompt([
                {
                    type: "input",
                    message: "What is the ID of the product you would like to re-stock?",
                    name: "itemID"
                },
                {
                    type: "input",
                    message: "How many of that item are you adding?",
                    name: "quantity"
                }
                ]).then(function(inquirerResponse) {
                    stckItem = inquirerResponse.itemID;
                    stckQty = parseInt(inquirerResponse.quantity);
                    perfStock(stckItem, stckQty);
                });
                break;
            case 'Add_New_Product':
                inquirer.prompt([
                {
                    type: "input",
                    message: "Product Name?",
                    name: "prod"
                },
                {
                    type: "input",
                    message: "Department Name?",
                    name: "dept"
                },
                {
                    type: "input",
                    message: "Price?",
                    name: "price"
                },
                {
                    type: "input",
                    message: "Quantity?",
                    name: "quant"
                },
                ]).then(function(inquirerResponse) {
                    var pName = inquirerResponse.prod;
                    var pDept = inquirerResponse.dept;
                    var pPrice = inquirerResponse.price;
                    var pQuant = parseInt(inquirerResponse.quant);
                    addProd(pName, pDept, pPrice, pQuant);
                });
                break;
            case 'exit':
                conn.end();
                break;

            default: 
                console.log(inquirerResponse.todo + "You Ediot!");

        };
    });
};

function perfQuery(sql, values) {
//build the sql query and then execute
    sqlPromise(conn, sql, values)
    .then(function(res, err) {

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

    managerView();        
 //   conn.end();
    }).catch(function(err){
        console.log("Error occurred: " + err);
    });
};

function perfStock(stckItem, stckQty) {
//build the sql query and then execute
    var sql = "SELECT * FROM PRODUCTS WHERE item_id = ?";
    var values = stckItem;
    sqlPromise(conn, sql, values)
    .then(function(res, err) {
        var curQty = parseInt(res[0].stock_quantity);
        var name = res[0].product_name;
        stckQty += curQty;
        sql = "UPDATE PRODUCTS SET stock_quantity =? WHERE item_id = ?";
        values = [stckQty, stckItem];
        sqlPromise(conn, sql, values)
       .then(function(res, err) {
            console.log("\n\nRe-stocked and updated item #: " + stckItem + "; Product Name " + name + " with " + stckQty + " units")

        }).catch(function(err){
            console.log("Error occurred: " + err);
        });

    managerView();        
 //   conn.end();
    }).catch(function(err){
        console.log("Error occurred: " + err);
    });
};

function addProd(pName, pDept, pPrice, pQuant) {
//build the sql query and then execute
    var sql = "INSERT INTO products SET ?";
    var values = 
    {
     product_name: pName,
     department_name: pDept,
     price: pPrice, 
     stock_quantity: pQuant
    };
    sqlPromise(conn, sql, values)
    .then(function(res, err) {
        console.log("\n\nAdded Product: Product Name: " + pName + ", Department Name: " + pDept + ", Price: " + pPrice + " Quantity: " + pQuant)

        managerView();        
 //   conn.end();
    }).catch(function(err){
        console.log("Error occurred: " + err);
    });
};