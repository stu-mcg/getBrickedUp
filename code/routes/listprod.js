const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');

    // Get the product name to search for
    let name = req.query.productName;
    let categoryName = req.query.categoryName
    if(name == undefined) name = "";
    
    /** $name now contains the search string the user entered
     Use it to build a query and print out the results. **/

    /** Create and validate connection **/

    /** Print out the ResultSet **/

    /** 
    For each product create a link of the form
    addcart?id=<productId>&name=<productName>&price=<productPrice>
    **/

    /**
        Useful code for formatting currency:
        let num = 2.89999;
        num = num.toFixed(2);
    **/

        (async function() {
            try {
                let pool = await sql.connect(dbConfig);
                let customer = req.session.authenticatedUser;
                let recProdHbs = [];
                let productsHbs = [];
                customerHbs = () => customer;
                if(customer){
                    let getUserMostFrequentCategory = 'Select categoryId, count(*) as NUM FROM product AS P, orderproduct AS OP, customer AS C, ordersummary AS OS WHERE P.productId = OP.productId AND OP.orderId = OS.orderId AND C.customerId = OS.customerId AND userid = @userid GROUP BY categoryId ORDER BY num DESC;'
                    let mostFrequentCategories = (await pool.request().input('userid', customer).query(getUserMostFrequentCategory));
                    //console.dir(mostFrequentCategories)
                    if(mostFrequentCategories.recordset.length > 0){
                        let categoryId = mostFrequentCategories.recordset[0].categoryId
                        let getProductsInCategory = "SELECT productId, productName, categoryName, productPrice, productImageURL FROM product JOIN category ON product.categoryId=category.categoryId WHERE category.categoryId = @categoryId"
                        let recommendedProducts = (await pool.request().input("categoryId", categoryId).query(getProductsInCategory)).recordset
                        console.dir(recommendedProducts.length);
                        for(let i = 0; i < recommendedProducts.length && i < 4; i++){
                           // let randomIndex = Math.floor(Math.random() * recommendedProducts.length)
                            console.dir(i);
                            let product = recommendedProducts[i]
                            recProdHbs[i] = {productId:`${product.productId}`,
                                        productNameUrl:`${product.productName.replace(/ /g, '%20')}`,
                                        productPriceUrl: `${product.productPrice}`,
                                        productPrice: `${product.productPrice.toFixed(2)}`,
                                        productName:`${product.productName}`,
                                        productCategory: `${product.categoryName}`,
                                        productImageURL: `${product.productImageURL}`,
                                        customer:`${customer}`
                                }         
                        }
                    }
                }
                let q = `SELECT productId, productName, categoryName, productPrice, productImageURL FROM product JOIN category ON product.categoryId=category.categoryId WHERE productName LIKE @name AND categoryName = @categoryName ORDER BY productName ASC`;
                if(categoryName == 'All' || categoryName == null){
                    q = `SELECT productId, productName, categoryName, productPrice, productImageURL FROM product JOIN category ON product.categoryId=category.categoryId WHERE productName LIKE @name ORDER BY productName ASC`;
                }
                let products = await pool.request().input('name', '%' + name + '%').input('categoryName', categoryName).query(q);
                for (let i = 0; i < products.recordset.length; i++) {
                    let product = products.recordset[i];
                    productsHbs[i] ={productId:`${product.productId}`,
                                productNameUrl:`${product.productName.replace(/ /g, '%20')}`,
                                productPriceUrl: `${product.productPrice}`,
                                productPrice: `${product.productPrice.toFixed(2)}`,
                                productName:`${product.productName}`,
                                productCategory: `${product.categoryName}`,
                                productImageURL: `${product.productImageURL}`
                    }
                }
                //console.dir(recProdHbs);
                //console.dir(productsHbs);
                return res.render('listprod',{layout: 'main',
                customer:customerHbs(),
                recommendedProducts: recProdHbs, 
                products:productsHbs
                });

            } catch(err) {
                console.dir(err);
                res.write(JSON.stringify(err));
                res.end();
            }
        })();
});

module.exports = router;
