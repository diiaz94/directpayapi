var express = require('express');
var userControllers = require('./controllers/user');
var productControllers = require('./controllers/product');
var transactionControllers = require('./controllers/transaction');

module.exports = function(app) {

    var apiRoutes = express.Router();


    apiRoutes.get('/', function(req, res) {
        res.json({
            message: 'Welcome to our api'
        });
    });

    /* Authenticate and Authorization processes */

    apiRoutes.get('/users', userControllers.list);
    apiRoutes.get('/products', productControllers.list);
    //apiRoutes.post('/transactions', transactionControllers.add);



    app.use('/api', apiRoutes);
}