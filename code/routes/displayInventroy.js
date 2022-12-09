const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<title>Get Bricked Up Order List</title>');

    let warehouseId = req.query.warehouseId;
    (async function() {
        try {
            res.write("<a href='/'>home</a><br>");
            res.write("<a href='/editInventory'>Update Inventory</a><br>");
            res.write("<h1>Product Inventory</h1>");
            res.write("<form method=\"get\" action=\"displayInventory\">Select Warehouse    <select size =\"1\" name=\"warehouseId\"><option>1</option><option>Out of stock</option></select><input type=\"submit\" value=\"Submit\"></form>");
                
            let pool = await sql.connect(dbConfig);
            if(warehouseId == 'Out of stock'){
                res.write(`<h1>Not In Stock</h1>`);
                let getProducts = "SELECT productId, productName FROM product WHERE productId NOT IN (SELECT productId FROM productinventory)"   
                let products = await pool.request().query(getProducts);
                res.write('<tr><table style="background-color: #b0c4ed" border = "1"><tr><th>Product ID</th><th>ProductName</th></tr>')
                for(let j = 0; j < products.recordset.length; j++){
                    let product = products.recordset[j];
                    res.write(`<tr><td>${product.productId}</td><td>${product.productName}</td></tr>`)
                }
                res.write("</table>")
            }else{
                res.write(`<h2>Warehouse: ${warehouseId}</h2>`); 
                let getInventory = "SELECT productId, productName, quantity FROM product NATURAL JOIN productinventory WHERE warehouseId IS @warehouseId"   
                let inventory = await pool.request().input('warehouseId', warehouseId).query(getInventory);
                res.write('<tr><table style="background-color: #b0c4ed" border = "1"><tr><th>Product ID</th><th>ProductName</th><th>Quantity</th></tr>')
                for(let j = 0; j < inventory.recordset.length; j++){
                    let product = inventory.recordset[j];
                    res.write(`<tr><td>${product.productId}</td><td>${product.productName}</td><td>${product.quantity}</td></tr>`)
                    }    
                res.write("</table>");
            }
            
            res.end();
        } catch(err) {
            console.dir(err);
            res.write("this error" + JSON.stringify(err));
            res.end();
        }
    })();
});

module.exports = router;
