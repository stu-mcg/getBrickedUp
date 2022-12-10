const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    auth.checkAuthentication(req, res);
    let userid = req.session.authenticatedUser;
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            let getUserAddress = "SELECT address, city, state, postalCode, country FROM customer WHERE userid = @userid"
            let userAddress = (await pool.request().input("userid", userid).query(getUserAddress)).recordset[0];
            res.render('checkout',{layout: 'main', 
                username: userid,
                address: userAddress.address,
                city: userAddress.city,
                state: userAddress.state,
                postalCode: userAddress.postalCode,
                country: userAddress.country
            });
        } catch(err) {
            res.render('checkout',{layout: 'main', username: userid});
        }
    })();
});

module.exports = router;