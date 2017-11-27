 var Product = require('../models/product');
 var util = require('../utils/util');

 exports.list = function(req, res) {
     Product.list({
         status: 'active'
     }, function(err, products) {
         if (err) {
             return util.errorResponse(res, err.name, err.extra);
         }
         return util.okResponse(res, 200, {
             products: products
         });
     });
 };

 exports.add = function(req, res) {

     Product.add(req.body,
         function(err, result) {
             if (err) {
                 return util.errorResponse(res, err.name, err.extra);
             }
             return util.okResponse(res, 201, result);
         });
 };