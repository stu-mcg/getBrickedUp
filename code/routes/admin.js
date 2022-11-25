const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');

router.get('/', function(req, res, next) {

	
	// TODO: Include files auth.jsp and jdbc.jsp
	
	
	
    res.setHeader('Content-Type', 'text/html');

    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

	    // TODO: Write SQL query that prints out total order amount by day
            
            res.write("<h1>Administrator Sales Report by Day</h1>");
            res.write("<table border=\"1\"><tr><th>Order Date</th><th>Total Order Amount</th></tr>");
            let q = "SELECT YEAR(orderDate) as yr, MONTH(orderDate) as m, DAY(orderDate) as d, SUM(totalAmount) AS total FROM ordersummary GROUP BY YEAR(orderDate), MONTH(orderDate), DAY(orderDate)";
            let sales = await pool.request().query(q);
            for(let i=0; i<sales.recordset.length; i++){
                let sale = sales.recordset[i];
                res.write(`<tr><td style=\"text-align: center\"> ${sale.yr+"-"+sale.m+"-"+sale.d}</td><td> ${sale.total}</td></tr>`);
            }
        } catch(err) {
            console.dir(err);
            res.write(err + "");
            res.end();
        }
    })();
});

module.exports = router;