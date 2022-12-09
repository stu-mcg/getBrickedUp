const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../auth');

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
            res.write("<h2 align=\"center\"><a href='/'>Home</a></h2>");
            res.write("<h2 align=\"center\"><a href='/admin'>Administrators</a></h2>");
            res.write("<h1 align=\"center\">Update Inventory</h1>");
            let pool = await sql.connect(dbConfig);
            res.write("<form align=\"center\" method=\"get\" action=\"editInventory\">Select Warehouse\t<select size =\"1\" name=\"warehouseId\">");
            let getWarehouses = "SELECT warehouseId FROM warehouse"
            let warehouse = await pool.request().query(getWarehouses)
            for(let i = 0; i < warehouse.recordset.length; i++){
                res.write(`<option>${warehouse.recordset[i].warehouseId}</option>`)
            }
            res.write("</select><input type=\"submit\" value=\"Submit\"><br><br>")

            if(warehouseId != undefined && warehouseId != null){
                let getProducts = "SELECT productId FROM product"   
                let products = await pool.request().query(getProducts);
                res.write(`Select Product ID <select size ="1" name="productId">`)
                for(let j = 0; j < products.recordset.length; j++){
                    let product = products.recordset[j];
                    res.write(`<option>${product.productId}</option>`)
                }
                res.write("</select><br><br>")
                res.write(`Enter new Quantity<input type="number" name="qty" size="10" required><input type="submit" value="Submit"></form><br>`)
            }
            if((warehouseId != null && warehouseId != undefined) && (productId != null && productId != undefined) && (newQuantity != null && newQuantity != undefined) && newQuantity > 0){
                let getPrice = "SELECT productPrice FROM product WHERE productId = @productId"
                let price = await (await pool.request().input('productId', productId).query(getPrice)).recordset[0].productPrice;
                let inInventory = "SELECT productId FROM productinventory WHERE productId = @productId"
                let target = await pool.request().input('productId', productId).query(inInventory)
                if(target.recordset.length == 0){
                    let update = "INSERT INTO productinventory VALUES (@productId, 1, @quantity, @price)"
                    await pool.request()
                    .input('productId', productId)
                    .input('quantity', newQuantity)
                    .input('price', price)
                    .query(update);
                    res.write('Quantity Updated!')
                }else{
                    let update = "UPDATE productinventory SET quantity = @quantity WHERE productId = @productId AND warehouseId = @warehouseId"
                    await pool.request()
                    .input('quantity', newQuantity)
                    .input('productId', productId)
                    .input('warehouseId', warehouseId)
                    .query(update);
                    res.write('Quantity Updated!')
                }
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