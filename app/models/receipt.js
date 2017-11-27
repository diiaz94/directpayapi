var Receipt = require('../schemas/receipt');
var mongoose = require('mongoose');

exports.commercesList = function(user, next) {


    if (!user) {
        return next({
            name: "MISSING_REQUIRED_FIELDS"
        });
    }

    Receipt.aggregate([{ $match: { status: "pending", "sent_to": mongoose.Types.ObjectId(user) } },
        {
            $lookup: {
                from: 'users',
                localField: 'sent_by',
                foreignField: '_id',
                as: 'commerce'
            }
        },
        { $unwind: "$commerce" },
        { $project: { type: 1, status: 1, name: "$commerce.name", description: "$commerce.description" } }
    ], function(err, receipts) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        } else if (receipts) {
            return next(null, { receipts: receipts });
        } else {
            return next({
                name: "INTERNAL_UKNOW_ERROR"
            });
        }
    });
}
exports.usersList = function(user, next) {


    if (!user) {
        return next({
            name: "MISSING_REQUIRED_FIELDS"
        });
    }

    Receipt.aggregate([{ $match: { status: "pending", "sent_to": mongoose.Types.ObjectId(user) } },
        {
            $lookup: {
                from: 'users',
                localField: 'sent_by',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: "$user" },
        { $project: { type: 1, status: 1, name: "$user.name", photo_url: "$user.photo_url" } }
    ], function(err, receipts) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        } else if (receipts) {
            return next(null, { receipts: receipts });
        } else {
            return next({
                name: "INTERNAL_UKNOW_ERROR"
            });
        }
    });
}

exports.add = function(attrs, next) {
    if (!attrs) {
        return next({
            name: "MISSING_REQUIRED_FIELDS"
        });
    }

    var newItem = new Receipt(attrs);
    newItem.save(function(err, result) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        } else if (result) {
            return next(null, newItem);
        } else {
            return next({
                name: "INTERNAL_UKNOW_ERROR"
            });
        }
    });

};