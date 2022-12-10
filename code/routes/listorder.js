const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    // res.write('<title>Get Bricked Up Order List</title>');

    /** Create connection, and validate that it connected successfully **/

    /**
    Useful code for formatting currency:
        let num = 2.87879778;
        num = num.toFixed(2);
    **/

    /** Write query to retrieve all order headers **/


    (async function() {
        try {
            orderH = [];
            orderP = [];

            // res.write("<h2 align=\"center\"><a href='/'>Home</a></h2>");
            // res.write("<h1 align=\"center\">Order List</h1>")
            let pool = await sql.connect(dbConfig);
            let q = "SELECT orderId, orderDate, O.customerId, firstName, lastName, totalAmount FROM ordersummary AS O, customer AS C WHERE O.customerId = C.customerId";
            let orderHeaders = await pool.request().query(q);

            for (let i = 0; i < orderHeaders.recordset.length; i++) {
                // res.write("<table align=\"center\" border = \"1\"><tr><th>Order Id</th><th>Order Date</th><th>Customer Id</th><th>Customer Name</th><th>Total Amount</th></tr>");
                let orderHeader = orderHeaders.recordset[i];
                //added line
                orderH[i]={
                    orderId: `${orderHeader.orderId}`,
                    orderDate: `${new Date(orderHeader.orderDate).toLocaleString('en-US', {hour12: false})}`,
                    customerId: `${orderHeader.customerId}`,
                    customerName: `${orderHeader.firstName} ${orderHeader.lastName}`,
                    totalAmount: `$${orderHeader.totalAmount.toFixed(2)}`
                }
                
                // res.write(`<tr><td>${orderHeader.orderId}</td><td>${new Date(orderHeader.orderDate).toLocaleString('en-US', {hour12: false})}</td><td>${orderHeader.customerId}</td><td>${orderHeader.firstName} ${orderHeader.lastName}</td><td>$${orderHeader.totalAmount.toFixed(2)}</td></tr>`)
                // res.write("<tr><td colspan = \"50\"><table border = \"1\" align=\"right\"><tr><th>Product Id</th><th>Quantity</th><th>Price</th></tr>")
                let q = `SELECT productId, quantity, price FROM orderproduct WHERE orderId = @orderId`;
                let orderProducts = await pool.request().input('orderId', orderHeader.orderId).query(q);
                for(let j = 0; j < orderProducts.recordset.length; j++){
                    let orderProduct = orderProducts.recordset[j];
                    //added line
                    orderP[j]={
                        pid:`${orderProduct.productId}`,
                        quantity: `${orderProduct.quantity}`,
                        price: `$${orderProduct.price.toFixed(2)}`
                    }
                    // res.write(`<tr><td>${orderProduct.productId}</td><td>${orderProduct.quantity}</td><td>$${orderProduct.price.toFixed(2)}</td></tr>`)
                }
                // res.write("</table></td></tr></table><br>");
            }
            const handlebars = require('handlebars');
            handlebars.registerHelper('date', function(con){
                return new Date().toLocaleString('en-US', {hour12: false});
            });

            return res.render('listorder', {layout: 'main',
            title: 'listOrder',
            orderH: orderH,
            orderP: orderP
        });

        } catch(err) {
            console.dir(err);
            res.write("this error" + JSON.stringify(err));
            res.end();
        }
    })();
});

module.exports = router;
