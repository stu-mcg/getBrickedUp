const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../auth');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<title>Get Bricked Up Order List</title>');

    let warehouseId = req.query.warehouseId;
    (async function() {
        try {
            res.write("<table align=\"center\"><tr><th><h2 align=\"center\"><a href='/'>Home</a></h2></th><th><h1>|</h1></th>");
            res.write("<th><h2 align=\"center\"><a href='/admin'>Back</a></h2></th></tr></table>");
            res.write("<h1 align=\"center\">Product Inventory</h1>");
            res.write("<form method=\"get\" action=\"displayInventory\" align=\"center\">Select Warehouse<select size =\"1\" name=\"warehouseId\">");
            let pool = await sql.connect(dbConfig);
            let getWarehouses = "SELECT warehouseId FROM warehouse"
            let warehouse = await pool.request().query(getWarehouses)
            for(let i = 0; i < warehouse.recordset.length; i++){
                res.write(`<option>${warehouse.recordset[i].warehouseId}</option>`)
            }
            res.write("<option>Out of stock</option></select><input type=\"submit\" value=\"Submit\"><br></form>");
            if(warehouseId == 'Out of stock'){
                res.write(`<h2 align="center">Not In Stock</h2>`);
                let getProducts = "SELECT productId, productName FROM product WHERE productId NOT IN (SELECT productId FROM productinventory)"   
                let products = await pool.request().query(getProducts);
                res.write('<table style="width:400" align="center"><tr><th>Product ID</th><th>ProductName</th></tr>')
                for(let j = 0; j < products.recordset.length; j++){
                    let product = products.recordset[j];
                    res.write(`<tr><td align="center">${product.productId}</td><td align="center">${product.productName}</td></tr>`)
                }
                res.write("</table>")
            }else if(warehouseId != undefined && warehouseId != null){
                res.write(`<h2 align="center">Warehouse: ${warehouseId}</h2>`); 
                let getInventory = "SELECT P.productId, productName, quantity FROM product AS P, productinventory AS I WHERE P.productId = I.productId AND warehouseId = @warehouseId"   
                let inventory = await pool.request().input('warehouseId', warehouseId).query(getInventory);
                res.write('<table style="width:600" align="center"><tr><th>Product ID</th><th>ProductName</th><th>Quantity</th></tr>')
                for(let j = 0; j < inventory.recordset.length; j++){
                    let product = inventory.recordset[j];
                    res.write(`<tr><td align="center">${product.productId}</td><td align="center">${product.productName}</td><td align="center">${product.quantity}</td></tr>`)
                    }    
                res.write("</table>");
            }
            res.write("<h2 align=\"center\"><a href='/editInventory'>Update Inventory</a></h2>");
            res.end();
        } catch(err) {
            console.dir(err);
            res.write("this error" + JSON.stringify(err));
            res.end();
        }
    })();
});

module.exports = router;
