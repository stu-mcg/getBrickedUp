const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function(req, res, next) {

    let customer = req.session.authenticatedUser;
    let email = req.query.email;
    let phonenum = req.query.phonenum;
    let address =req.query.address;
    let city=req.query.city;
    let state=req.query.state;
    let postalCode=req.query.postalCode;
    let country =req.query.country;
    let password=req.query.password;


    (async function() {
        try {
             let pool = await sql.connect(dbConfig);
             //check username not taken
             let update = "UPDATE customer SET email = @email, phonenum = @phonenum, address = @address, city = @city, state = @state, postalCode = @postalCode, country = @country, password = @password WHERE userid = @userid"
             await pool.request()
             .input('email', email)
             .input('phonenum', phonenum)
             .input('address', address)
             .input('city', city)
             .input('state', state)
             .input('postalCode', postalCode)
             .input('country', country)
             .input('password', password)
             .input('userid', customer)
             .query(update);
             res.redirect("/login");
           

        } catch(err) {
            console.dir(err);
            res.write(JSON.stringify(err));
            res.end();
        }
    })();
});

module.exports = router;