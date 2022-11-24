const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            productId = req.query.id
            let getProductInfo = "SELECT productId, productName, productPrice, productImageURL, productImage, productDesc FROM product WHERE productId = @productId"
            let info = await (await pool.request().input("productId", productId).query(getProductInfo)).recordset[0]
            res.write(`ID: ${info.productId}<br>`)
            res.write(`Name: ${info.productName}<br>`)
            res.write(`Price: $${info.productPrice.toFixed(2)}<br>`)
            if(info.productImageURL != null){
                res.write(`ImageURL: <img src = "${info.productImageURL}"><br>`)
            }
            if(info.productImage != null){
                res.write(`Image: <img src = "displayImage?id=${info.productId}"><br>`)
            }
            res.write(`Desc: ${info.productDesc}<br>`)
            res.write(`<a href = addcart?id=${info.productId}&name=${info.productName.replace(/ /g, '%20')}&price=${info.productPrice}>Add to Cart</a><br>`)
            res.write(`<a href = "listProd">Continue Shopping</a>`)
	// TODO: Retrieve and display info for the product

	// TODO: If there is a productImageURL, display using IMG tag

	// TODO: Retrieve any image stored directly in database. Note: Call displayImage.jsp with product id as parameter.

	// TODO: Add links to Add to Cart and Continue Shopping

            res.end()
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
