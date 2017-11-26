var Receipt = require('../schemas/receipt');

exports.list = function(match, next) {

    if (!match) {
        return next({
            name: "MISSING_REQUIRED_FIELDS"
        });
    }

    Receipt.find(match, function(err, receipts) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        } else if (receipts) {
            return next(null, receipts);
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