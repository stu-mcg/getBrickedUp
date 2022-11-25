const express = require('express');
const router = express.Router();
const sql = require('mssql');
const auth = require('../auth');

router.get('/', function(req, res, next) {

    res.setHeader('Content-Type', 'text/html');
    
    res.write("<h1>Customer Profile</h1>");
    res.end()
    // TODO: Print Customer information

    (async function() {
        try {

	// TODO: Print customer info
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
