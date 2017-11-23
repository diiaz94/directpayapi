var order = require('../models/order');
var util = require('../utils/util');

exports.list = function(req, res) {
    order.list({
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

    console.log(req.body);
    /*order.add(req.body,
        function(err, result) {
            if (err) {
                return util.errorResponse(res, err.name, err.extra);
            }
            return util.okResponse(res, 201, result);
        });*/
};