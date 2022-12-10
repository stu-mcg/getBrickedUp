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

            salesHbs = [];
            customersHbs = [];
            // const chartjs = require('chart.js');
            let customer = req.session.authenticatedUser;
            customerHbs = () => customer;

	    // TODO: Write SQL query that prints out total order amount by day

            let totalQ = "SELECT SUM(totalAmount) AS total, COUNT(*) AS orders FROM ordersummary";
            let total = await pool.request().query(totalQ);
            let totals = total.recordset[0];
            totalSales = () => totals.total;
            totalOrders = () => totals.orders;

            let q = "SELECT YEAR(orderDate) as yr, MONTH(orderDate) as m, DAY(orderDate) as d, SUM(totalAmount) AS total FROM ordersummary GROUP BY YEAR(orderDate), MONTH(orderDate), DAY(orderDate)";
            let sales = await pool.request().query(q);

            const dataO=[]

            for(let i=0; i<sales.recordset.length; i++){
                let sale = sales.recordset[i];
                salesHbs[i] = {
                    orderDate:`${sale.yr+"-"+sale.m+"-"+sale.d}`,
                    toa:`${sale.total.toFixed(2)}`
                }
                // dataO.push(`${sale.yr+"-"+sale.m+"-"+sale.d}`);              
            }
            const dataS=[]
            

            let q2 = "SELECT orderDate, SUM(totalAmount) AS total FROM ordersummary GROUP BY orderDate";
            let sales2=await pool.request().query(q2);
            for(let i=0;i<sales2.recordset.length;i++){
                let sale2 = sales2.recordset[i];
                dataS.push(sale2.total.toFixed(2));
                dataO[i] ={
                    date: `${sale2.orderDate.toDateString()}`
                }
                
            }
            
            



            let cusQ = "SELECT customerId, firstName, lastName FROM customer";
            let customerList = await pool.request().query(cusQ);
            for(let i=0; i<customerList.recordset.length; i++){
                let customerL = customerList.recordset[i];
                customersHbs[i] = {
                    firstName:`${customerL.firstName}`,
                    lastName:`${customerL.lastName}`,
                    customerId:`${customerL.customerId}`
                }
            }

            
            return res.render('admin',{layout: 'main',
            title:"Admin",
            totalSales:totalSales(),
            totalOrders:totalOrders(),
            salesHbs:salesHbs,
            customersHbs:customersHbs,
            username: customerHbs(),
            dataS: dataS,
            dataO: dataO
            });         
        } catch(err) {
            console.dir(err);
            res.write(err + "");
            res.end();
        }
    })();
});

module.exports = router;