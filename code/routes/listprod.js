const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>YOUR NAME Grocery</title>")

    // Get the product name to search for
    let name = req.query.productName;
    let categoryName = req.query.categoryName
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
                res.write("<form method=\"get\" action=\"listprod\"><select size =\"1\" name=\"categoryName\"><option>All</option><option>Beverages</option><option>Condiments</option><option>Confections</option><option>Dairy Products</option><option>Grains/Cereals</option><option>Meat/Poultry</option><option>Produce</option><option>Seafood</option></select><input type=\"text\" name=\"productName\" size=\"50\"><input type=\"submit\" value=\"Submit\"><input type=\"reset\" value=\"Reset\">(Leave blank for all products)</form>");
                res.write("<h2>All Products</h2>")
                res.write("<table style= \"background-color: #f5f5dc\" border = \"1\"><tr><th>Add to Cart</th><th>Product Name</th><th>Categories</th><th>Price</th></tr>")
                let pool = await sql.connect(dbConfig);
                let q = `SELECT productId, productName, categoryName, productPrice FROM product JOIN category ON product.categoryId=category.categoryId WHERE productName LIKE @name AND categoryName = @categoryName ORDER BY productName ASC`;
                if(categoryName == 'All' || categoryName == null){
                    q = `SELECT productId, productName, categoryName, productPrice FROM product JOIN category ON product.categoryId=category.categoryId WHERE productName LIKE @name ORDER BY productName ASC`;
                }
                let products = await pool.request().input('name', '%' + name + '%').input('categoryName', categoryName).query(q);
                for (let i = 0; i < products.recordset.length; i++) {
                    let product = products.recordset[i];
                    res.write(`<tr><td style=\"text-align: center\"><a href = addcart?id=${product.productId}&name=${product.productName.replace(/ /g, '%20')}&price=${product.productPrice}> Add </a></td><td>${product.productName}</td><td>${product.categoryName}</td><td>${product.productPrice.toFixed(2)}</td></tr>`)
                }
                res.write("</table>");
                res.end();
            } catch(err) {
                console.dir(err);
                res.write(JSON.stringify(err));
                res.end();
            }
        })();
});

module.exports = router;
