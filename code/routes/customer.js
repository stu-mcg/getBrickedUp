const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../auth');

router.get('/', function(req, res, next) {
    auth.checkAuthentication(req, res);
    auth.checkAuthentication(req, res);
    res.setHeader('Content-Type', 'text/html');
    let customer = req.session.authenticatedUser;
    // TODO: Print Customer information
    (async function() {
        try {
            res.write("<table align=\"center\"><tr><th><h2 align=\"center\"><a href='/'>Home</a></h2></th><th><h1>|</h1></th>");
            res.write("<th><h2 align=\"center\"><a href='/listUserOrders'>My Orders</a></h2></th><th><h1>|</h1></th>");
            res.write("<th><h2 align=\"center\"><a href='/editAccount'>Edit Account Info</a></h2></tr></table>");
           

	    // TODO: Print customer info
            let pool = await sql.connect(dbConfig);
            let q = "SELECT * FROM customer WHERE userid = @username";
            let info = await pool.request().input("username", customer).query(q);
            res.write("<h1 align=\"center\">Customer Profile</h1>");
            res.write(`<table align="center" style="width:400"><tr><td>ID</td><td> ${info.recordset[0].customerId}</td></tr>`);
            res.write(`<tr><td>First Name</td><td> ${info.recordset[0].firstName}</td></tr>`);
            res.write(`<tr><td>Last Name</td><td> ${info.recordset[0].lastName}</td></tr>`);
            res.write(`<tr><td>Email</td><td> ${info.recordset[0].email}</td></tr>`);
            res.write(`<tr><td>Phone Number</td><td> ${info.recordset[0].phonenum}</td></tr>`);
            res.write(`<tr><td>Address</td><td> ${info.recordset[0].address}</td></tr>`);
            res.write(`<tr><td>City</td><td> ${info.recordset[0].city}</td></tr>`);
            res.write(`<tr><td>State</td><td> ${info.recordset[0].state}</td></tr>`);
            res.write(`<tr><td>Postal Code</td><td> ${info.recordset[0].postalCode}</td></tr>`);
            res.write(`<tr><td>Country</td><td> ${info.recordset[0].country}</td></tr>`);
            res.write(`<tr><td>User ID</td><td> ${info.recordset[0].userid}</td></tr></table>`);
            res.end();
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
