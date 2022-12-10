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
        customerId = () => info.recordset[0].customerId;
        firstName = () => info.recordset[0].firstName;
        lastName = () => info.recordset[0].lastName; 
        email = () => info.recordset[0].email;
        phonenum = () => info.recordset[0].phonenum;
        address = () => info.recordset[0].address; 
        city = () => info.recordset[0].city;
        state = () => info.recordset[0].state; 
        postalCode = () => info.recordset[0].postalCode;
        country = () => info.recordset[0].country; 
        userid = () => info.recordset[0].userid; 
        password = () => info.recordset[0].password;

        return res.render('editAccount', {layout:'main',
        title:"edit Account",
        customerId:customerId,
        firstName:firstName,
        lastName:lastName,
        email:email,
        phonenum:phonenum,
        address:address,
        city:city,
        state: state,
        postalCode: postalCode,
        country: country,
        userid: userid,
        password:password,
        username:customer
    });
       
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;