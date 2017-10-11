var Product = require('../schemas/product');

exports.list = function(match, next) {

    if (!match) {
        return next({
            name: "MISSING_REQUIRED_FIELDS"
        });
    }

    Product.find(match, function(err, users) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        } else if (users) {
            return next(null, users);
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

    var newProduct = new Product(attrs);
    newProduct.save(function(err, result) {
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