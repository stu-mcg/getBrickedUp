const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');


router.get('/', function(req, res, next){
    
    let pid = req.query.pId;
    let pname = req.query.pName;
    let categoryId = req.query.catId;
    let prodprice = req.query.price2;
    let prodDesc = req.query.prodDesc2;

    
    console.dir(pid);
    
    (async function(){
        try{
            let pool = await sql.connect(dbConfig);

            
            let q = "UPDATE product SET productName = @pname, categoryId = @categoryId, productPrice=@prodPrice, productDesc=@prodDesc WHERE productId=@prodid";
            await pool.request().input('pname',pname).input('categoryId', categoryId).input('prodPrice', prodprice).input('prodDesc',prodDesc).input('prodid', pid).query(q);
            res.redirect("/");

            res.end();

        } catch(err){
            console.dir(err);
            res.write(JSON.stringify(err));
            res.end();
        }
    })();
   
 
});
module.exports = router;