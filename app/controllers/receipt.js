var Receipt = require('../models/receipt');
var Order = require('../models/order');
var util = require('../utils/util');
var async = require('async');

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

    var sent_by = req.body.sent_by;
    var sent_to = req.body.sent_to;
    var type = req.body.type;
    var total = req.body.total

    async.waterfall([
        function saveReceipt(callback) {
            Receipt.add({
                    sent_by: sent_by,
                    sent_to: sent_to,
                    type: type
                },
                function(err, receipt) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, receipt);
                });
        },
        function saveReference(receipt, callback) {
            if (type == "ticket") {
                //TODO


            } else if (type == "order") {
                Order.add({ receipt: receipt._id, total: total }, function(err, data) {
                    if (err) {
                        return util.errorResponse(res, err.name, err.extra);
                    }
                    callback(null)
                });
            } else {
                callback({
                    name: "INTERNAL_ERROR"
                });
            }
        }
    ], function(err, data) {

        if (err) {
            return util.errorResponse(res, err.name, err.extra);
        }

        return util.okResponse(res, 201, { message: "receipt created successfully" });
    });
};