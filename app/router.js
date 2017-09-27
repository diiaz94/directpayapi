var express = require('express');
var authMidleware = require('./midlewares/auth');
var authController = require('./controllers/auth');
var dropboxController = require('./controllers/dropbox');
var locationController = require('./controllers/location');
var userController = require('./controllers/user');
var requestController = require('./controllers/request');
var supplyController = require('./controllers/supply');

var adminController = require('./controllers/admin/main');

module.exports = function(app) {

    var apiRoutes = express.Router();


    apiRoutes.get('/', function(req, res) {
        res.json({
            message: 'Welcome to our api'
        });
    });

    /* Authenticate and Authorization processes */

    apiRoutes.post('/signin', authController.signin);
    apiRoutes.post('/accounts/facebook', authController.acountsFacebook);
    apiRoutes.post('/signup', authController.signup);
    apiRoutes.get('/signout', authMidleware.authenticate, authController.signout);


    apiRoutes.post('/upload', dropboxController.upload);
    apiRoutes.get('/waashgreen/:rut/:name', dropboxController.download);

    apiRoutes.get('/countries', locationController.countries);

    //apiRoutes.get('/locations', locationController.locations); //generation
    apiRoutes.get('/regions', locationController.regions);

    //apiRoutes.post('/add-commune', locationController.addComune);

    //Admin routes
    apiRoutes.get('/admin/dashboard', authMidleware.authenticate, authMidleware.admin, adminController.dashboard);
    apiRoutes.get('/admin/reports', authMidleware.authenticate, authMidleware.admin, adminController.reports);
    apiRoutes.get('/admin/users/detail', authMidleware.authenticate, authMidleware.admin, userController.detail);
    apiRoutes.get('/admin/users', authMidleware.authenticate, authMidleware.admin, userController.list);
    apiRoutes.post('/admin/users', authMidleware.authenticate, authMidleware.admin, userController.createAdmin);
    apiRoutes.delete('/admin/users', authMidleware.authenticate, authMidleware.admin, userController.delete);
    apiRoutes.get('/admin/requests', authMidleware.authenticate, authMidleware.admin, requestController.list);
    apiRoutes.patch('/admin/requests/status', authMidleware.authenticate, authMidleware.admin, requestController.updateStatus);

    apiRoutes.post('/admin/supplies', authMidleware.authenticate, authMidleware.admin, supplyController.assign);
    apiRoutes.get('/admin/supplies/types', authMidleware.authenticate, authMidleware.admin, supplyController.types);

    app.use('/api', apiRoutes);
}