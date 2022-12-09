const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');


router.get('/', function(req, res, next) {

	
	// TODO: Include files auth.jsp and jdbc.jsp
	auth.checkAuthentication(req, res);
	
    
    

    res.setHeader('Content-Type', 'text/html');

    (async function() {
        try {
            let pool = await sql.connect(dbConfig);

            // const chartjs = require('chart.js');

	    // TODO: Write SQL query that prints out total order amount by day
            res.write("<a href='/displayInventory'>Product Inventory by Warehouse</a><br>");
            res.write(`<h1 align=center><a href='/'>home</a></h1>`);

            let totalQ = "SELECT SUM(totalAmount) AS total, COUNT(*) AS orders FROM ordersummary";
            let total = await pool.request().query(totalQ);
            let totals = total.recordset[0];
            res.write(`<h3 align=center>Total Sales: ${totals.total}</h3><h3 align=center>Total Orders: ${totals.orders}</h3>`);

            res.write("<h1 align=center>Administrator Sales Report by Day</h1>");
            res.write("<table border=\"1\" align=center><tr><th>Order Date</th><th>Total Order Amount</th></tr>");
            let q = "SELECT YEAR(orderDate) as yr, MONTH(orderDate) as m, DAY(orderDate) as d, SUM(totalAmount) AS total FROM ordersummary GROUP BY YEAR(orderDate), MONTH(orderDate), DAY(orderDate)";
            let sales = await pool.request().query(q);

           

            for(let i=0; i<sales.recordset.length; i++){
                let sale = sales.recordset[i];
                res.write(`<tr><td style=\"text-align: center\"> ${sale.yr+"-"+sale.m+"-"+sale.d}</td><td> $${sale.total.toFixed(2)}</td></tr>`);
              
            }
            const dataS=[]
            const dataO=[]

            let q2 = "SELECT orderDate, SUM(totalAmount) AS total FROM ordersummary GROUP BY orderDate";
            let sales2=await pool.request().query(q2);
            for(let i=0;i<sales2.recordset.length;i++){
                let sale2 = sales2.recordset[i];
                dataS.push(sale2.total.toFixed(2));
                dataO.push(sale2.orderDate);
            }
            
            const data = {
                labels: dataO,
                datasets:[
                    {
                    label: 'Sales',
                    data: dataS,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                    }
                ]
            };
            const options = {
                scales: {
                    yAxes: [
                        {
                            ticks:{
                                beginsAtZero:true
                            }
                        }
                    ]
                }
            };
            // const chart = new chartjs('line',{data,options});
         
            
            res.write(`</table><h1 align=center>List of all customers</h1>`);
            let cusQ = "SELECT customerId, firstName, lastName FROM customer";
            res.write(`<table border=\"1" align=center><tr><th>First Name</th><th>Last Name</th><th>Customer ID</th></tr>`);
            let customerList = await pool.request().query(cusQ);
            for(let i=0; i<customerList.recordset.length; i++){
                let customerL = customerList.recordset[i];
                res.write(`<tr><td style =\"text-align: center\"> ${customerL.firstName}</td><td>${customerL.lastName}</td><td>${customerL.customerId}</td></tr>`);
            }
            res.write(`</table><br><h1 align=center><a href='/addprod'>Add a New Product</a></h1>`);
            res.write(`<h1 align=center><a href='/updateDelete'>Update a Product</a></h1>`);
            

            
            
            
          

            res.end();
        } catch(err) {
            console.dir(err);
            res.write(err + "");
            res.end();
        }
    })();
});

module.exports = router;