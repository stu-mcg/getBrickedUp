const express = require('express');
const router = express.Router();
const auth = require('../auth');


router.get('/', function(req, res, next){

    auth.checkAuthentication(req, res);

    res.setHeader('Content-type', 'text/html');
    let error = req.query.Errormsg;

    (async function(){
        try{
            

            
            res.write(`<h1 align=center>Add new Product</h1>`);
            res.write(`<form method="get" action="insertProd">`);
            res.write(`<table align=center><tr><td><b>Product Name</b></td><td><input type="text" name="prodName" size="80" required></td></tr>`);
            res.write(`<tr><td><b>Category Id</b></td><td><input type="text" name="categoryId" size="80" required></td></tr>`);
            res.write(`<tr><td><b>Product description</b></td><td><input type="text" name="prodDesc" size="80" required></td></tr>`);
            res.write(`<tr><td><b>Product Price</b></td><td><input type="numbers" min="0" step="any" name="prodPrice" size="80" required></td></tr></table>`);
            res.write(`<h2 align=center><button type="submit"  value ="add" name="Submit" align=center style="height:35px;width=80px">Update</button></h2>`);
            console.log(req.query.Submit);
            if(error){
                res.write(`<h2 align=center>${error}</h2>`);
            }
            res.end();

        } catch(err){
            console.dir(err);
            res.write(JSON.stringify(err));
            res.end();
        }
    })();
   
 
});
module.exports = router;