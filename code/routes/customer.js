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
	// TODO: Print customer info
        let pool = await sql.connect(dbConfig);
        let q = "SELECT * FROM customer WHERE userid = @username";
        let info = await pool.request().input("username", customer).query(q);
        res.write("<h1>Customer Profile</h1>");
        res.write(`<table border=\"1\" style=\"background-color: #b0c4ed\"><tr><td>ID</td><td> ${info.recordset[0].customerId}</td></tr>`);
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
        res.write("<table><tr><td><a href='/editAccount'>Edit Account Info</a></td></tr>");
        res.write("<tr><td><a href='/listUserOrders'>My Orders</a></td></tr></table>");
        res.write("<tr><td><a href='/'>home</a></td></tr></table>");
        res.end();

        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
