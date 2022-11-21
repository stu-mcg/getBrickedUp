const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>YOUR NAME Grocery Order Processing</title>");

    let customerId = req.query.customerId;
    let password = req.query.password;

    let productList = false;
    if (req.session.productList && req.session.productList.length > 0) {
        productList = req.session.productList.filter(function (e) {
            return e != null;
        });;
    }
    //check for empty cart
    if(!productList || productList.length == 0){
        res.write("<h2>There is nothing in the cart, <a href = 'listprod'>return to the shopping page</a></h2>")
        res.end()
        return;
    }

    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            //check id is valid
            let getCustomerIds = `SELECT customerId FROM customer`;
            let ids = await (await pool.request().query(getCustomerIds)).recordset;
            if(!ids.find(e => e.customerId == customerId)){
                res.write("<h2>Invalid customer id entered, <a href = 'checkout'>try again</a></h2>")
                res.end();
                return;
            }
            //check password
            let getPassword = "SELECT password FROM CUSTOMER WHERE customerId = @customerId"
            let passwordResult = await pool.request().input('customerId', customerId).query(getPassword);
            let customerPassword = passwordResult.recordset[0].password;
            if(password != customerPassword){
                res.write("<h2>Incorrect password, <a href = 'checkout'>try again</a></h2>")
                res.end();
                return;
            }


            //insert order summery
            let insertSum = "INSERT INTO ordersummary (customerId, orderDate, totalAmount) OUTPUT INSERTED.orderId VALUES(@customerId, GETDATE(), 0)";
            let result = await pool.request().input('customerId', customerId).query(insertSum);
            let orderId = result.recordset[0].orderId;

            //insert order products
            for (let i = 0; i < productList.length; i++) {
                let product = productList[i];
                if (!product) {
                    continue;
                }
                let insertProd = "INSERT INTO orderproduct (orderId, productId, quantity, price) VALUES (@orderId, @productId, @productAmount, @productPrice)";
                await pool.request()
                .input('orderId', orderId)
                .input('productId', product.id)
                .input('productAmount', product.quantity)
                .input('productPrice', product.price)
                .query(insertProd)
            }
            //update total price
            let updatePrice = "UPDATE ordersummary SET totalAmount = (SELECT SUM(price * quantity) as total FROM orderproduct WHERE orderId = @orderId GROUP BY orderId)"
            await pool.request().input('orderId', orderId).query(updatePrice)
            
            //print order summary
            res.write("<h2>Order Summary</h2>")
            getOrderSum = "SELECT orderDate, O.customerId, firstName, lastName, totalAmount FROM ordersummary AS O, customer AS C WHERE O.customerId = C.customerId AND orderId = @orderId";
            let orderHeader = await (await pool.request().input('orderId', orderId).query(getOrderSum)).recordset[0];
            res.write("<table border = \"1\"><tr><th>Order Id</th><th>Order Date</th><th>Customer Id</th><th>Customer Name</th><th>Total Amount</th></tr>");
            res.write(`<tr><td>${orderId}</td><td>${new Date(orderHeader.orderDate).toLocaleString('en-US', {hour12: false})}</td><td>${orderHeader.customerId}</td><td>${orderHeader.firstName} ${orderHeader.lastName}</td><td>$${orderHeader.totalAmount.toFixed(2)}</td></tr>`)
            res.write("<tr><td colspan = \"50\"><table border = \"1\" align=\"right\"><tr><th>Product Id</th><th>Quantity</th><th>Price</th></tr>")
            getOrderProd = `SELECT productId, quantity, price FROM orderproduct WHERE orderId = @orderId`;
            let orderProducts = await pool.request().input('orderId', orderId).query(getOrderProd);
            for(let j = 0; j < orderProducts.recordset.length; j++){
                let orderProduct = orderProducts.recordset[j];
                res.write(`<tr><td>${orderProduct.productId}</td><td>${orderProduct.quantity}</td><td>$${orderProduct.price.toFixed(2)}</td></tr>`)
            }
            res.write("</table></td></tr></table><br>");
            res.write("<a href='/'>return to home</a>")

            //reset cart
            req.session.productList = [];
            res.end()

        } catch(err) {
            console.dir(err);
            res.write(JSON.stringify(err));
            res.end();
        }
    })();

    /**
    Determine if valid customer id was entered
    Determine if there are products in the shopping cart
    If either are not true, display an error message
    **/

    /** Make connection and validate **/

    /** Save order information to database**/

        /**
        // Use retrieval of auto-generated keys.
        sqlQuery = "INSERT INTO <TABLE> OUTPUT INSERTED.orderId VALUES( ... )";
        let result = await pool.request()
            .input(...)
            .query(sqlQuery);
        // Catch errors generated by the query
        let orderId = result.recordset[0].orderId;
        **/

    /** Insert each item into OrderedProduct table using OrderId from previous INSERT **/

    /** Update total amount for order record **/

    /** For each entry in the productList is an array with key values: id, name, quantity, price **/

    /**
        for (let i = 0; i < productList.length; i++) {
            let product = products[i];
            if (!product) {
                continue;
            }
            // Use product.id, product.name, product.quantity, and product.price here
        }
    **/

    /** Print out order summary **/

    /** Clear session/cart **/
});

module.exports = router;
