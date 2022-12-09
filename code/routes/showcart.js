const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
    let productList = false;
    res.setHeader('Content-Type', 'text/html');
    cart = [];
    let total = 0;
    let customer = req.session.authenticatedUser;

    if (req.session.productList) {
        productList = req.session.productList;

        for (let i = 0; i < productList.length; i++) {
            product = productList[i];
            if (!product) {
                continue
            }

            cart[i] = {productId:product.id,
                productNameURL:product.name.replace(/ /g, '%20'),
                productName:product.name,
                productPrice:product.price,
                productPriceHbs:Number(product.price).toFixed(2),
                price:(Number(product.quantity).toFixed(2) * Number(product.price)).toFixed(2),
                productQuantity:product.quantity,
                productQuantityNeg:Number(-product.quantity),
            }
            total = total + product.quantity * product.price;

            // res.write("<tr><td>" + product.id + "</td>");
            // res.write("<td>" + product.name + "</td>");

            // res.write(`<td align=\"center\"><a href="addcart?id=${product.id}&name=${product.name.replace(/ /g, '%20')}&price=${product.price}&amount=-1" style="text-decoration: none">-</a>${product.quantity}<a href="addcart?id=${product.id}&name=${product.name.replace(/ /g, '%20')}&price=${product.price}&amount=1" style="text-decoration: none">+</a></td>`);

            // res.write("<td align=\"right\">$" + Number(product.price).toFixed(2) + "</td>");
            // res.write("<td align=\"right\">$" + (Number(product.quantity).toFixed(2) * Number(product.price)).toFixed(2) + "</td>");
            // res.write(`<td><a href="addcart?id=${product.id}&name=${product.name.replace(/ /g, '%20')}&price=${product.price}&amount=${Number(-product.quantity)}" style="text-decoration: none">remove all</a></td>`)
            // res.write("</tr>");
        }
        // res.write("<tr><td colspan=\"4\" align=\"right\"><b>Order Total</b></td><td align=\"right\">$" + total.toFixed(2) + "</td></tr>");
        // res.write("</table>");

        // res.write("<h2><a href=\"checkout\">Check Out</a></h2>");
    // } else{
    //     res.write("<h1>Your shopping cart is empty!</h1>");
    }
    // res.write('<h2><a href="listprod">Continue Shopping</a></h2>');

    return res.render('showcart',{layout: 'main',
    title:"Your Cart",
    cart:cart,
    total:total.toFixed(2),
    username:customer
    });
});

module.exports = router;
