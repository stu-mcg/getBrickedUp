const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write("<title>Create Account</title>")
    let error = req.query.Errormsg
    
            try {
            
                //write page
                res.write("<h1 align=center>Create Account</h1>");
                res.write('<form method="get" action="insertUser">');
                res.write('<table align=center><tr><td>First Name</td><td><input type="text" name="firstName" size="50" required></td><tr>');
                res.write('<tr><td>Last Name</td><td><input type="text" name="lastName" size="50" required></td><tr>');
                res.write('<tr><td>email</td><td><input type="text" name="email" size="50" required></td><tr>');
                res.write('<tr><td>Phone Number</td><td><input type="tel" name="phonenum" placeholder="[###]-[###]-[####]" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" size="50" required></td><tr>');
                res.write('<tr><td>Address</td><td><input type="text" name="address" size="50" required></td><tr>');
                res.write('<tr><td>City</td><td><input type="text" name="city" size="50" required></td><tr>');
                res.write('<tr><td>State/Province</td><td><input type="text" name="state" size="50" required></td><tr>');
                res.write('<tr><td>Postal Code</td><td><input type="text" name="postalCode" size="50" required></td><tr>');
                res.write('<tr><td>Country</td><td><input type="text" name="country" size="50" required></td><tr>');
                res.write('<tr><td>Username</td><td><input type="text" name="userid" size="50" required></td><tr>');
                res.write('<tr><td>Password</td><td><input type="password" name="password" size="50" required></td><tr>');
                res.write("<tr><td></td><td align=\"right\"><button type=\"submit\" value=\"Submit\">Create Account</button><td></tr>");
                res.write("</table></form>");
                if(error){
                    res.write(`<h2 align=center>${error}</h2>`);
                }
                res.end();
             
               
            } catch(err) {
                console.dir(err);
                res.write(JSON.stringify(err));
                res.end();
            }
});

module.exports = router;