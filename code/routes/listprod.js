const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>YOUR NAME Grocery</title>")

    // Get the product name to search for
    let name = req.query.productName;
    if(name == undefined) name = "";
    
    /** $name now contains the search string the user entered
     Use it to build a query and print out the results. **/

    /** Create and validate connection **/

    /** Print out the ResultSet **/

    /** 
    For each product create a link of the form
    addcart?id=<productId>&name=<productName>&price=<productPrice>
    **/

    /**
        Useful code for formatting currency:
        let num = 2.89999;
        num = num.toFixed(2);
    **/

        (async function() {
            try {
                res.write("<h1>Search for the products you want to buy:</h1>")
                res.write("<form method=\"get\" action=\"listprod\"><input type=\"text\" name=\"productName\" size=\"50\"><input type=\"submit\" value=\"Submit\">(Leave blank for all products)</form>");
                res.write("<table><tr><th></th><th>Product Name</th><th>Price</th></tr>")
                let pool = await sql.connect(dbConfig);
                let q = `SELECT productId, productName, productPrice FROM product WHERE productName LIKE \'%${name}%\' ORDER BY productName ASC`;
                console.log(name)
                let products = await pool.request().query(q);
                for (let i = 0; i < products.recordset.length; i++) {
                    let product = products.recordset[i];
                    res.write(`<tr><td><a href = addcart?id=${product.productId}&name=${product.productName.replace(/ /g, '%20')}&price=${product.productPrice}>add to cart</a></td><td>${product.productName}</td><td>${product.productPrice.toFixed(2)}</td></tr>`)
                }
                res.write("</table>");
                res.end();
            } catch(err) {
                console.dir(err);
                res.write("this error" + JSON.stringify(err));
                res.end();
            }
        })();
});

module.exports = router;
