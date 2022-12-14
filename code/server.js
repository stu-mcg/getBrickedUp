const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session')
const bodyParser  = require('body-parser');

let index = require('./routes/index');
let loadData = require('./routes/loaddata');
let listOrder = require('./routes/listorder');
let listProd = require('./routes/listprod');
let addCart = require('./routes/addcart');
let showCart = require('./routes/showcart');
let checkout = require('./routes/checkout');
let order = require('./routes/order');
let login = require('./routes/login');
let validateLogin = require('./routes/validateLogin');
let logout = require('./routes/logout');
let admin = require('./routes/admin');
let product = require('./routes/product');
let displayImage = require('./routes/displayImage');
let customer = require('./routes/customer');
let ship = require('./routes/ship');
let createAccount = require('./routes/createAccount');
let editAccount = require('./routes/editAccount');
let insertUser = require('./routes/insertUser');
let addReview = require('./routes/addReview');
let listUserOrders = require('./routes/listUserOrders');
let updateUser = require('./routes/updateUser');
let addprod = require('./routes/addprod');
let insertProd = require('./routes/insertprod');
let displayInventory = require('./routes/displayInventroy')
let editInventory = require('./routes/editInventory')
let updateDelete = require('./routes/updateDelete');
let updateProd = require('./routes/updateProd');

const app = express();

// Enable parsing of requests for POST requests
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// This DB Config is accessible globally
dbConfig = {    
  server: 'cosc304_sqlserver',
  database: 'orders',
  user: 'sa', 
  password: '304#sa#pw',
  options: {      
    encrypt: false,      
    enableArithAbort:false,
  }
}

// Setting up the session.
// This uses MemoryStorage which is not
// recommended for production use.
app.use(session({
  secret: 'COSC 304 Rules!',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false,
    secure: false,
    maxAge: 60000,
  }
}))
//
// Setting up the rendering engine
app.engine('handlebars', exphbs({
  layoutsDir: `${__dirname}/views/layouts`,
}));
app.set('view engine', 'handlebars');


// Setting up where static assets should
// be served from.
app.use(express.static('public'));

// Setting up Express.js routes.
// These present a "route" on the URL of the site.
// Eg: http://127.0.0.1/loaddata
app.use('/', index);
app.use('/loaddata', loadData);
app.use('/listorder', listOrder);
app.use('/listprod', listProd);
app.use('/addcart', addCart);
app.use('/showcart', showCart);
app.use('/checkout', checkout);
app.use('/order', order);
app.use('/login', login);
app.use('/validateLogin', validateLogin);
app.use('/logout', logout);
app.use('/admin', admin);
app.use('/product', product);
app.use('/displayImage', displayImage);
app.use('/customer', customer);
app.use('/ship', ship);
app.use('/createAccount', createAccount);
app.use('/editAccount', editAccount);
app.use('/insertUser', insertUser);
app.use('/addReview', addReview);
app.use('/listUserOrders', listUserOrders);
app.use('/updateUser', updateUser);
app.use('/addprod', addprod);
app.use('/insertprod',insertProd);
app.use('/displayInventory', displayInventory);
app.use('/editInventory', editInventory);
app.use('/updateDelete', updateDelete);
app.use('/updateProd', updateProd);

// Starting our Express app
app.listen(3000)