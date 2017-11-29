var Receipt = require('../schemas/receipt');
var mongoose = require('mongoose');

exports.commercesList = function(user, next) {


    if (!user) {
        return next({
            name: "MISSING_REQUIRED_FIELDS"
        });
    }

    Receipt.aggregate([{ $match: { status: "pending", $or: [{ "sent_to": mongoose.Types.ObjectId(user) }, { "sent_by": mongoose.Types.ObjectId(user) }] } },
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
        { $project: { type: 1, status: 1, name: "$user.name", photo_url: "$user.photo_url", user_id: "$user._id" } }
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


    Receipt.findOne({ sent_to: attrs.sent_to, sent_by: attrs.sent_by }, function(err, receipt) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        } else if (receipt) {
            console.log("exist")
            return next(null, receipt);
        } else {
            console.log("NOT exist")

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
        }

    });

};

exports.update = function(find, attrs, next) {
    if (!find || !attrs) {
        return next({
            name: "MISSING_REQUIRED_FIELDS"
        });
    }

    Receipt.update(find, attrs, function(err, result) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        } else if (result) {
            return next(null, result);
        } else {
            return next({
                name: "INTERNAL_UKNOW_ERROR"
            });
        }
    });

}