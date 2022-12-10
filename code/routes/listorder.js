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
            let customer = req.session.authenticatedUser;
            customerHbs = () => customer;
            let pool = await sql.connect(dbConfig);
            let q = "SELECT orderId, orderDate, O.customerId, firstName, lastName, totalAmount FROM ordersummary AS O, customer AS C WHERE O.customerId = C.customerId";
            let orderHeaders = await pool.request().query(q);

            for (let i = 0; i < orderHeaders.recordset.length; i++) {
                let orderHeader = orderHeaders.recordset[i];
                orderH[i]={
                    orderId: `${orderHeader.orderId}`,
                    orderDate: `${new Date(orderHeader.orderDate).toLocaleString('en-US', {hour12: false})}`,
                    customerId: `${orderHeader.customerId}`,
                    customerName: `${orderHeader.firstName} ${orderHeader.lastName}`,
                    totalAmount: `${orderHeader.totalAmount.toFixed(2)}`
                }
                
                let q = `SELECT productId, quantity, price FROM orderproduct WHERE orderId = @orderId`;
                let orderProducts = await pool.request().input('orderId', orderHeader.orderId).query(q);

                orderP = [];
                for(let j = 0; j < orderProducts.recordset.length; j++){
                    let orderProduct = orderProducts.recordset[j];
                    orderP[j]={
                        pid:`${orderProduct.productId}`,
                        quantity: `${orderProduct.quantity}`,
                        price: `$${orderProduct.price.toFixed(2)}`
                    }
                    orderH[i].orderP= orderP;

                }
            }
            const handlebars = require('handlebars');
            handlebars.registerHelper('date', function(con){
                return new Date().toLocaleString('en-US', {hour12: false});
            });

            return res.render('listorder', {layout: 'main',
            title: 'listOrder',
            orderH: orderH,
            orderP: orderP,
            username: customerHbs
        });

        } catch(err) {
            console.dir(err);
            res.write("this error" + JSON.stringify(err));
            res.end();
        }
    })();
});

module.exports = router;
