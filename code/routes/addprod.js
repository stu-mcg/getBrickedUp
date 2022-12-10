const express = require('express');
const router = express.Router();
const auth = require('../auth');


router.get('/', function(req, res, next){

    auth.checkAuthentication(req, res);

    res.setHeader('Content-type', 'text/html');
    let error = req.query.Errormsg;

    (async function(){
        try{
       
           
            res.render('addprod', {layout: 'main',
            title: 'addprod'
        })
            

        } catch(err){
            console.dir(err);
            res.write(JSON.stringify(err));
            res.end();
        }
    })();
   
 
});
module.exports = router;