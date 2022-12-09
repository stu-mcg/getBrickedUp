const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {

        let prodName = req.query.prodName;
        let categoryId = req.query.categoryId;
        let prodDesc = req.query.prodDesc;
        let prodPrice = req.query.prodPrice;


        // console.log(req.body.action);
    (async function(){
        try{
            let pool = await sql.connect(dbConfig);
            let insert = "INSERT INTO product(productName, categoryId, productDesc, productPrice) VALUES (@prodName , @categoryId , @prodDesc, @prodPrice);"
            await pool.request().input('prodName', prodName).input('categoryId', categoryId).input('prodDesc', prodDesc).input('prodPrice', prodPrice).query(insert);
            res.redirect("/admin");

        }catch(err){
            console.dir(err);
            res.write(JSON.stringify(err));
            res.end();
        }
    })();
});
module.exports = router;