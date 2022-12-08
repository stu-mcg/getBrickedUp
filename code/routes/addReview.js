const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    let productId = req.query.productId;
    let reviewRating = req.query.rating;
    let reviewComment = req.query.comment
    let userid = req.session.authenticatedUser;
    let reviewFailedMessage = "";
    if(!(userid)){
        reviewFailedMessage = "You must be logged in to review a product";
        return res.redirect(`/product?id=${productId}&reviewFailedMessage=${reviewFailedMessage}`);
    }
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            let checkForReview = `SELECT * FROM review as R, customer as C WHERE R.customerId = C.customerId AND userid = @userid AND productId = @productId`;
            if((await pool.request().input("userid", userid).input("productId", productId).query(checkForReview)).recordset.length > 0){
                reviewFailedMessage = "You have already left a review on this product. You cannot leave another";
                return res.redirect(`/product?id=${productId}&reviewFailedMessage=${reviewFailedMessage}`);
            }
            let getCustomerId = `SELECT customerId FROM customer WHERE userid = @userID`;
                let customerId = (await pool.request().input("userid", userid).query(getCustomerId)).recordset[0].customerId;
                let insertReview = `INSERT INTO review (reviewRating, reviewDate, customerId, productId, reviewComment) VALUES(@reviewRating, GETDATE(), @customerId, @productId, @reviewComment)`;
                await pool.request().input("reviewRating", reviewRating).input("customerId", customerId).input("productId", productId).input("reviewComment", reviewComment).query(insertReview);
        } catch(err) {
            console.log("Add review error:")
            console.dir(err);
            // res.write(JSON.stringify(err));
            // res.end();
        }
        res.redirect(`/product?id=${productId}`);
    })();
});

module.exports = router;