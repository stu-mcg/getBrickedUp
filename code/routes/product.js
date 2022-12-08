const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            productId = req.query.id
            let getProductInfo = "SELECT productId, productName, productPrice, productImageURL, productImage, productDesc FROM product WHERE productId = @productId"
            let info = await (await pool.request().input("productId", productId).query(getProductInfo)).recordset[0]

            productName = () => info.productName; 
            productId = () => info.productId;
            productPrice = () => info.productPrice;
            productDesc = () => info.productDesc;

           if(info.productImageURL != null && info.productImage != null){
                images = () => `<img src = ${info.productImageURL}> <img src = displayImage?id=${info.productId}`
               return res.render('prod',{layout: 'main', 
                title: productName(), 
                productId: productId(), 
                productName: productName(),
                productPrice: productPrice(),
                images: images(),
                productDesc: productDesc()
            });
            }
            else if(info.productImageURL != null && info.productImage == null ){
                images = () => `<img src = ${info.productImageURL}>`
                return res.render('prod',{layout: 'main', 
                 title: productName(), 
                 productId: productId(), 
                 productName: productName(),
                 productPrice: productPrice(),
                 images: images(),
                 productDesc: productDesc()
            });
            }
            else if((info.productImage != null && info.productImageURL == null)){
                images = () => `<img src = displayImage?id=${info.productId}`
                return res.render('prod',{layout: 'main', 
                title: productName(), 
                productId: productId(), 
                productName: productName(),
                productPrice: productPrice(),
                images: images(),
                productDesc: productDesc()
            });
            }
            else{
                return res.render('prod',{layout: 'main', 
                title: productName(), 
                productId: productId(), 
                productName: productName(),
                productPrice: productPrice(),
                productDesc: productDesc()
            });
        }
       
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
