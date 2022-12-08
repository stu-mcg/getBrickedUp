const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../auth');

router.get('/', function(req, res, next) {
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
        res.write(`<table border="1" style="background-color: #b0c4ed"><tr><td>ID</td><td>${info.recordset[0].customerId}</td></tr>`);
        res.write(`<tr><td>First Name</td><td><input type="text" name="firstName" value="${info.recordset[0].firstName}" size="50" required></td></tr>`);
        res.write(`<tr><td>Last Name</td><td><input type="text" name="lastName" value="${info.recordset[0].lastName}" size="50" required> </td></tr>`);
        res.write(`<tr><td>Email</td><td><input type="text" name="email" value="${info.recordset[0].email}" size="50" required></td></tr>`);
        res.write(`<tr><td>Phone Number</td><td><input type="tel" name="phonenum" value="${info.recordset[0].phonenum}" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" size="50" required></td></tr>`);
        res.write(`<tr><td>Address</td><td><input type="text" name="address" value="${info.recordset[0].address}" size="50" required> </td></tr>`);
        res.write(`<tr><td>City</td><td><input type="text" name="city" value="${info.recordset[0].city}" size="50" required> </td></tr>`);
        res.write(`<tr><td>State</td><td><input type="text" name="state" value="${info.recordset[0].state}" size="50" required> </td></tr>`);
        res.write(`<tr><td>Postal Code</td><td><input type="text" name="postalCode" value="${info.recordset[0].postalCode}" size="50" required></td></tr>`);
        res.write(`<tr><td>Country</td><td><input type="text" name="country" value="${info.recordset[0].country}" size="50" required> </td></tr>`);
        res.write(`<tr><td>User ID</td><td><input type="text" name="userid" value="${info.recordset[0].userid}" size="50" required> </td></tr>`);
        res.write(`<tr><td>Password</td><td><input type="password" name="password" value="${info.recordset[0].password}" size="50" required> </td></tr></table>`);
        res.write("<table><tr><td></td><td align=\"right\"><button type=\"submit\" value=\"Submit\">Update</button><td></tr></table>");
        res.write("<a href='/'>home</a>");
        res.end();
        //validate input on click

        //update data 
        if(validated){
            let update = "UPDATE customer SET firstName = @firstName, lastName = @lastName, email = @email, phonenum = @phonenum, address = @address, city = @city, state = @state, postalCode = @postalCode, country = @country WHERE userid = @userid"
            await pool.request()
            .input('firstName', firs)
        }

        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;