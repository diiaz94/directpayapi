var Receipt = require('../models/receipt');
var Order = require('../models/order');
var User = require('../models/user');
var util = require('../utils/util');
var async = require('async');

exports.list = function(req, res) {
    var logged_user = req.query.user_id;
    //console.log(logged_user)
    async.waterfall([
        function getUser(callback) {
            User.get(logged_user,
                function(err, result) {
                    if (err) {
                        return callback(err);
                    }

                    callback(null, result.user);
                });
        },
        function findList(user, callback) {
            if (user.role == "customer") {
                Receipt.commercesList(logged_user, function(err, result) {
                    if (err) {
                        callback(err);
                    }

                    return callback(null, result);
                });
            } else if (user.role == "commerce") {
                Receipt.usersList(logged_user, function(err, result) {
                    if (err) {
                        callback(err);
                    }

                    return callback(null, result);
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

        return util.okResponse(res, 201, data);
    });
};

exports.commercesList = function(req, res) {
    var logged_user = req.user_id;


    Receipt.commercesList(logged_user, function(err, receipts) {
        if (err) {
            return util.errorResponse(res, err.name, err.extra);
        }

        return util.okResponse(res, 201, { receipts: "receipt created successfully" });
    });

    async.waterfall([
        function getUser(callback) {
            User.get(logged_user,
                function(err, user) {
                    if (err) {
                        return callback(err);
                    }
                    callback(null, user);
                });
        },
        function findList(user, callback) {

            if (user.type == "customer") {


            } else if (user.type == "commerce") {

            } else {
                callback({
                    name: "INTERNAL_ERROR"
                });
            }
        }
    ], function(err, data) {


    });
};

exports.add = function(req, res) {

    var sent_by = req.body.sent_by;
    var sent_to = req.body.sent_to;
    var type = req.body.type;
    var total = req.body.total

    console.log(req.body);
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


exports.update = function(req, res) {

    var receipt = req.body.receipt;
    var status = req.body.status;


    Receipt.update({ _id: receipt }, {
            status: status
        },
        function(err, data) {

            if (err) {
                return util.errorResponse(res, err.name, err.extra);
            }

            return util.okResponse(res, 201, { message: "receipt updated successfully" });

        });

}