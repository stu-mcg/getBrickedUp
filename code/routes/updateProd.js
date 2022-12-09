const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');

router.get('/', function(req, res, next){

    
    let pid = updateDelete.pid;
    let pname = req.query.pName;
    let categoryId = req.query.catId;
    let prodprice = req.query.prodPrice;
    let prodDesc = req.query.prodDesc2;

    
    console.log(pid);
    
   

    (async function(){
        try{
            let pool = await sql.connect(dbConfig);

            
            let q = "UPDATE Product SET productname = @pname, categoryId = @categoryId, productPrice=@prodPrice, productDesc=@prodDesc WHERE productId=@prodid";
            await pool.request().input('prodid', pid).input('pname',pname).input('categoryId', categoryId).input('prodPrice', prodprice).input('prodDesc',prodDesc).query(q);
            res.redirect("/admin");

            res.end();

        } catch(err){
            console.dir(err);
            res.write(JSON.stringify(err));
            res.end();
        }
    })();
   
 
});
module.exports = router;