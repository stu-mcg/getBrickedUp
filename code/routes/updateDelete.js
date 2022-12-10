const express = require('express');
const router = express.Router();
const auth = require('../auth');
const sql = require('mssql');

router.get('/', function(req, res, next){

    res.setHeader('Content-type', 'text/html');

    
    let error = req.query.Errormsg;

    (async function(){
        try{
            let pool = await sql.connect(dbConfig);

            res.write(`<h1 align=center>Update a product</h1>`);
            let q = "SELECT productName, productId FROM product";
            res.write(`<h2 align=center>Select the product:<h2>`);
            res.write(`<h3><form method="get" align = "center" ><select size ="1" style="font-size:16px"  name="prodName2">`);
            let pName = await pool.query(q);
            for(let i=0; i<pName.recordset.length;i++){
                let option1 = pName.recordset[i].productName;
                res.write(`<option>${option1}</option>`);
            }
                

            res.write(`</select><button type="submit" name="submit" style="font-size:15px">Submit</button></form></h3>`);
            
            let pname2 = req.query.prodName2;

            if(pname2!=undefined){
                
                res.write(`<table align=center style="font-size:15px">`);
                let q2 = "SELECT * FROM product WHERE productName=@pname";
                let p2 = await pool.request().input("pname", pname2).query(q2);
                res.write(`<form method="get" action="updateProd" >`);

                let pid = p2.recordset[0].productId;
                res.write(`<tr><td><b>Product Id</b></td><td name="pId">${p2.recordset[0].productId}</td></tr>`)
                res.write(`<tr><td><b>Product Name</b></td><td><input type="text" name="pName" value="${p2.recordset[0].productName}" size="80" style="font-size:15px"</td></tr>`);
                res.write(`<tr><td><b>Product Price</b></td><td><input type="text" name="price2" value="${p2.recordset[0].productPrice.toFixed(2)}" size="80" style="font-size:15px"</td></tr>`);
                res.write(`<tr><td><b>Product Category</b></td><td><input type="text" name="catId" value="${p2.recordset[0].categoryId}" size="80" style="font-size:15px"</td></tr>`);
                res.write(`<tr><td><b>Product Description</b></td><td><input type="text" name="prodDesc2" value="${p2.recordset[0].productDesc}" size="80" style="font-size:15px"</td></tr></table>`);
                res.write(`<h2 align=center><button type="submit" style="font-size:25px;color:#9f3074">Update</button></h2></form>`);

                

                
            }
           
           
            res.end();

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