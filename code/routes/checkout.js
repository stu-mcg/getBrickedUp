const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Grocery CheckOut Line</title>");

    res.write("<h1>Login to complete the transaction:</h1>");

    res.write('<form method="get" action="order">');
    res.write('Username: <input type="text" name="username" size="50"><br>');
    res.write('Password: <input type="password", name="password" size="50"><br>');
    res.write('<input type="submit" value="Submit">');
    res.write('</form>');

    res.end();
});

module.exports = router;
