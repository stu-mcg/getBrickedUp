const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../auth');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    auth.checkAuthentication(req, res);
    let customer = req.session.authenticatedUser;
    res.write(`<title>${customer} Order List</title>`);

    /** Create connection, and validate that it connected successfully **/

    /**
    Useful code for formatting currency:
        let num = 2.87879778;
        num = num.toFixed(2);
    **/

    /** Write query to retrieve all order headers **/
    (async function() {
        try {
            res.write("<h1>Order List</h1>")
            let pool = await sql.connect(dbConfig);
            let getOrders = "SELECT orderId, orderDate, O.customerId, firstName, lastName, totalAmount FROM ordersummary AS O, customer AS C WHERE O.customerId = C.customerId AND C.userid = @userid";
            let orderHeaders = await pool.request().input("userid", customer).query(getOrders);
            for (let i = 0; i < orderHeaders.recordset.length; i++) {
                res.write("<table style= \"background-color: #b0c4ed\"border = \"1\"><tr><th>Order Id</th><th>Order Date</th><th>Customer Id</th><th>Customer Name</th><th>Total Amount</th></tr>");
                let orderHeader = orderHeaders.recordset[i];
                res.write(`<tr><td>${orderHeader.orderId}</td><td>${new Date(orderHeader.orderDate).toLocaleString('en-US', {hour12: false})}</td><td>${orderHeader.customerId}</td><td>${orderHeader.firstName} ${orderHeader.lastName}</td><td>$${orderHeader.totalAmount.toFixed(2)}</td></tr>`)
                res.write("<tr><td colspan = \"50\"><table border = \"1\" align=\"right\"><tr><th>Product Id</th><th>Quantity</th><th>Price</th></tr>")
                let q = `SELECT productId, quantity, price FROM orderproduct WHERE orderId = @orderId`;
                let orderProducts = await pool.request().input('orderId', orderHeader.orderId).query(q);
                for(let j = 0; j < orderProducts.recordset.length; j++){
                    let orderProduct = orderProducts.recordset[j];
                    res.write(`<tr><td>${orderProduct.productId}</td><td>${orderProduct.quantity}</td><td>$${orderProduct.price.toFixed(2)}</td></tr>`)
                }
                res.write("</table></td></tr></table><br>");
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
