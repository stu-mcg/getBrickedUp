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
            productIdHbs = () => info.productId;
            productPrice = () => info.productPrice;
            productDesc = () => info.productDesc;
            prodNameURL = () => info.productName.replace(/ /g, '%20');

            console.dir((await pool.request().query("Select * FROM review")).recordset)

            let getReviews = `SELECT reviewRating, reviewDate, reviewComment, userid FROM review as R, customer AS C WHERE C.customerId = R.customerId and productId = @productId;`
            reviews = (await pool.request().input("productId", productId).query(getReviews)).recordset
            let reviewsHbs = [];
            for(let i = 0; i < reviews.length; i++){
                let review = reviews[i]
                reviewsHbs[i] = {userid:`${review.userid}`,
                                reviewRating:`${review.reviewRating}`,
                                reviewComment: `${review.reviewComment}`,
                                reviewDate: `${new Date(review.reviewDate).toDateString()}`
                            }         
            }
            errorMessage = () => req.query.reviewFailedMessage;
            //console.dir(reviewsHbs);
            //console.dir("peepee" + req.query.reviewFailedMessage);
            if(info.productImageURL != null ){
                images = () => `<img src = ${info.productImageURL}>`
               return res.render('prod',{layout: 'main', 
                title: productName(), 
                productId: productIdHbs(), 
                productName: productName(),
                productPrice: productPrice(),
                images: images(),
                productDesc: productDesc(),
                prodNameURL: prodNameURL(),
                reviews:reviewsHbs,
                errorMessage: errorMessage()
            });
            }
            else{
                return res.render('prod',{layout: 'main', 
                title: productName(), 
                productId: productIdHbs(), 
                productName: productName(),
                productPrice: productPrice(),
                productDesc: productDesc(),
                prodNameURL: prodNameURL(),
                reviews:reviewsHbs,
                errorMessage: errorMessage()
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
