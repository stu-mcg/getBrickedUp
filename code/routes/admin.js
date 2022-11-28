const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');

router.get('/', function(req, res, next) {

	
	// TODO: Include files auth.jsp and jdbc.jsp
	auth.checkAuthentication(req, res)
	
	
    res.setHeader('Content-Type', 'text/html');

    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

	    // TODO: Write SQL query that prints out total order amount by day
            
            res.write("<h1>Administrator Sales Report by Day</h1>");
            res.write("<table border=\"1\"><tr><th>Order Date</th><th>Total Order Amount</th></tr>");
            let q = "SELECT orderDate, SUM(totalAmount) AS total FROM ordersummary GROUP BY orderDate";
            let dates = await pool.request().query(q);
            for(let i=0; i<dates.recordset.length; i++){
                let date = dates.recordset[i];
                res.write(`<tr><td style=\"text-align: center\"> ${new Date(date.orderDate).toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric'})}</td><td> $${date.total.toFixed(2)}</td></tr>`);
            }
            res.end()
        } catch(err) {
            console.dir(err);
            res.write(err + "");
            res.end();
        }
    })();
});

module.exports = router;