const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function(req, res, next) {
   
    let firstName = req.query.firstName;
    let lastName = req.query.lastName;
    let email = req.query.email;
    let phonenum = req.query.phonenum;
    let address =req.query.address;
    let city=req.query.city;
    let state=req.query.state;
    let postalCode=req.query.postalCode;
    let country =req.query.country;
    let userid=req.query.userid;
    let password=req.query.password;


    (async function() {
        try {
             let pool = await sql.connect(dbConfig);
             //check username not taken
             let getusers = "SELECT userid FROM customer WHERE userid = @userid";
             let otherusers = await pool.request().input('userid', userid).query(getusers);
             if(otherusers.recordset.length != 0){
                res.redirect("/createAccount?Errormsg=Username already taken");
                return
            }
             let insert = "INSERT INTO customer (firstName, lastName, email, phonenum, address, city, state, postalCode, country, userid, password) VALUES (@firstName, @lastName, @email, @phonenum, @address, @city, @state, @postalCode, @country, @userid, @password)";
             await pool.request()
             .input('firstName', firstName)
             .input('lastName', lastName)
             .input('email', email)
             .input('phonenum', phonenum)
             .input('address', address)
             .input('city', city)
             .input('state', state)
             .input('postalCode', postalCode)
             .input('country', country)
             .input('userid', userid)
             .input('password', password)
             .query(insert);
             res.redirect("/login");
           

        } catch(err) {
            console.dir(err);
            res.write(JSON.stringify(err));
            res.end();
        }
    })();
});

module.exports = router;
