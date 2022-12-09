const express = require('express');
const router = express.Router();

// Rendering the main page
router.get('/', function (req, res) {
    let username = false;
    // TODO: Display user name that is logged in (or nothing if not logged in)
    if(req.session.authenticatedUser){
        username=req.session.authenticatedUser
    }	
    res.render('index', {layout:'main',
                username: username
    });
    
})

module.exports = router;
