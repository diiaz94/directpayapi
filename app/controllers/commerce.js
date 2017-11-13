var Commerce = require('../models/commerce');
var util = require('../utils/util');

exports.list = function(req, res) {
    Commerce.list({
        status: 'active'
    }, function(err, commerces) {
        if (err) {
            return util.errorResponse(res, err.name, err.extra);
        }
        return util.okResponse(res, 200, {
            commerces: commerces
        });
    });
};

exports.add = function(req, res) {

    Commerce.add(req.body,
        function(err, result) {
            if (err) {
                return util.errorResponse(res, err.name, err.extra);
            }
            return util.okResponse(res, 201, result);
        });
};