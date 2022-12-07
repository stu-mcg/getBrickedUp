const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');

router.post('/', function(req, res) {
    // Have to preserve async context since we make an async call
    // to the database in the validateLogin function.
    (async () => {
        let authenticatedUser = await validateLogin(req);
        req.session.authenticatedUser = authenticatedUser
        if (authenticatedUser) {
            let originalUrl = req.session.originalUrl
            req.session.originalUrl = "/"
            res.redirect(originalUrl);
        } else {
            req.session.loginMessage = "Incorrect login details";
            res.redirect("/login");
        }
     })();
});

async function validateLogin(req) {
    if (!req.body || !req.body.username || !req.body.password) {
        return false;
    }

    let username = req.body.username;
    let password = req.body.password;
    let authenticatedUser =  await (async function() {
        try {
            let pool = await sql.connect(dbConfig);

	// TODO: Check if userId and password match some customer account. 
	// If so, set authenticatedUser to be the username.
            let getPassword ="SELECT password FROM customer WHERE userid = @username";
            let userPassword = await (await pool.request().input('username', username).query(getPassword)).recordset[0].password;
            if(password != undefined && userPassword == password){
                return username
            }
            return false;
            
        } catch(err) {
            console.dir(err);
            return false;
        }
    })();
    return authenticatedUser;
}

module.exports = router;
