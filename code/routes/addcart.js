const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    // If the product list isn't set in the session,
    // create a new list.
    let productList = false;
    if (!req.session.productList) {
        productList = [];
    } else {
        productList = req.session.productList;
    }

    // Add new product selected
    // Get product information
    let id = false;
    let name = false;
    let price = false;
    let amount = 1;
    if (req.query.id && req.query.name && req.query.price) {
        id = req.query.id;
        name = req.query.name;
        price = req.query.price;
    } else {
        res.redirect("/listprod");
    }
    if(req.query.amount){
        console.dir(req.query.amount)
        amount = Number(req.query.amount)
        console.dir(amount)
    }

    // Update quantity if add same item to order again
    if (productList[id]){
        productList[id].quantity = productList[id].quantity + amount;
    } else {
        productList[id] = {
            "id": id,
            "name": name,
            "price": price,
            "quantity": amount
        };
    }

    if(productList[id].quantity < 1){
        productList.splice(id, 1)
    }

    req.session.productList = productList;
    res.redirect("/showcart");
});

module.exports = router;
