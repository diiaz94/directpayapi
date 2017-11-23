var Order = require('../schemas/order');

exports.list = function(match, next) {

    if (!match) {
        return next({
            name: "MISSING_REQUIRED_FIELDS"
        });
    }

    Order.find(match, function(err, orders) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        } else if (orders) {
            return next(null, orders);
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

    var newOrder = new Order(attrs);
    newOrder.save(function(err, result) {
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