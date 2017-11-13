var Receipt = require('../models/receipt');
var util = require('../utils/util');

exports.list = function(req, res) {
    Receipt.list(req.query, function(err, receipts) {
        if (err) {
            return util.errorResponse(res, err.name, err.extra);
        }
        return util.okResponse(res, 200, {
            receipts: receipts
        });
    });
};

exports.add = function(req, res) {

    Receipt.add(req.body,
        function(err, result) {
            if (err) {
                return util.errorResponse(res, err.name, err.extra);
            }
            return util.okResponse(res, 201, result);
        });
};