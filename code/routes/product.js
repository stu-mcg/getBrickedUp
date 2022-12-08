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

            productName = () => info.productName.replace(/ /g, '%20'); 
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
        	// TODO: Retrieve and display info for the product

            res.write(`<br><br><h2>Leave a review:</h2>`)
            if(req.query.reviewFailedMessage){
                res.write(`<h3>${req.query.reviewFailedMessage}</h3>`)
            }
            res.write(`
            <form action="/addReview">
            <input type="hidden" id="productId" name="productId" value="${productId}">
                <label>Rating:</label>
                <select id="rating" name="rating">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <p>Comment:</p>
                <textarea id="comment" name="comment" rows="4" cols="50"></textarea>
                <br>
                <input type="submit" value="Submit">
            </form>
            `)

            res.write(`<br><br><h2>Reviews:</h2>`)
            let getReviews = `SELECT reviewRating, reviewDate, reviewComment, userid FROM review as R, customer AS C WHERE C.customerId = R.customerId and productId = @productId;`
            reviews = (await pool.request().input("productId", productId).query(getReviews)).recordset
            for(let i = 0; i < reviews.length; i++){
                let review = reviews[i]
                res.write(`<div style = "border:1px solid black"><h3>${review.userid} rated ${review.reviewRating}/5 on ${new Date(review.reviewDate).toDateString()}</h3><p>${review.reviewComment}</p><br></div>`)
            }
            res.end()
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;
