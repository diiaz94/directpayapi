var express = require('express');
var userController = require('./controllers/user');
var productController = require('./controllers/product');
var commerceController = require('./controllers/commerce');
var receiptController = require('./controllers/receipt');
var transactionController = require('./controllers/transaction');
var orderController = require('./controllers/order');

module.exports = function(app) {

    var apiRoutes = express.Router();


    apiRoutes.get('/', function(req, res) {
        res.json({
            message: 'Welcome to our api'
        });
    });

    /* Authenticate and Authorization processes */

    apiRoutes.get('/users', userController.list);
    apiRoutes.post('/users', userController.add);
    apiRoutes.get('/products', productController.list);
    apiRoutes.post('/products', productController.add);
    apiRoutes.get('/commerces', userController.list);
    apiRoutes.post('/commerces', commerceController.add);
    apiRoutes.get('/receipts', receiptController.list);
    apiRoutes.post('/receipts', receiptController.add);


    apiRoutes.post('/orders', orderController.add);

    //apiRoutes.post('/order', orderController.add);

    //apiRoutes.post('/transactions', transactionControllers.add);



    app.use('/v1', apiRoutes);
}