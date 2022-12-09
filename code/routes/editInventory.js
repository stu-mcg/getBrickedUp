const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<title>Get Bricked Up Order List</title>');
//<input type="text" name="email" value="${info.recordset[0].email}" size="50" required>
//spinner with names and id to edit quantity

    let warehouseId = req.query.warehouseId;
    let productId = req.query.productId;
    let newQuantity = req.query.qty;
    (async function() {
        try {
            res.write("<a href='/'>home</a>");
            res.write("<h1>Product Inventory</h1>");
            res.write("<form method=\"get\" action=\"editInventory\">Select Warehouse    <select size =\"1\" name=\"warehouseId\"><option>1</option><option>Out of stock</option></select><input type=\"submit\" value=\"Submit\"><br>");
            
            let pool = await sql.connect(dbConfig);
            if(warehouseId == 'Out of stock'){
                let getProducts = "SELECT productId FROM product WHERE productId NOT IN (SELECT productId FROM productinventory)"   
                let products = await pool.request().query(getProducts);
                res.write(`<select size ="1" name="productId">`)
                for(let j = 0; j < products.recordset.length; j++){
                    let product = products.recordset[j];
                    res.write(`<option>${product.productId}</option>`)
                }
                res.write("</select><input type=\"submit\" value=\"Submit\"><br>")
            }else{
                let getInventory = "SELECT productId FROM product JOIN productinventory WHERE warehouseId IS @warehouseId"   
                let inventory = await pool.request().input('warehouseId', warehouseId).query(getInventory);
                res.write(`<select size ="1" name="productId">`)              
                  for(let j = 0; j < inventory.recordset.length; j++){
                    let product = inventory.recordset[j];
                    res.write(`<option>${product.productId}</option>`)
                    }    
                    res.write("</select><input type=\"submit\" value=\"Submit\"><br>")          
                }
            res.write(`Enter new Quantity<input type="number" name="qty" size="10" required><input type="submit" value="Submit"></form><br>`)

            if((warehouseId != null || warehouseId != undefined) && (productId != null || productId != undefined) && (newQuantity != null || newQuantity != undefined)){
                let update = "UPDATE productinventory SET quantity = @quantity WHERE productId = @productId AND warehouseId = @warehouseId"
                await pool.request()
                .input('productId', productId)
                .input('warehouseId', warehouseId)
                .query(update);
                res.write('Quantity Updated!')
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