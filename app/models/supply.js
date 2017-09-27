var Supply = require('../schemas/supply');
var mongoose = require('mongoose');

exports.add = function(attrs, next) {

    if (!attrs) {
        return next({
            name: "MISSING_REQUIRED_FIELDS"
        })
    }

    var supply = new Supply(attrs);

    supply.save(function(err, supply) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        }
        return next(null, {
            supply: supply
        });
    });
}


exports.providerSupplies = function(provider, next) {

    Supply.aggregate([{
            $group: { _id: { "assign_to": "$assign_to", "productType": "$product.type", "measure": "$product.measure" }, qty: { $sum: "$qty" } }
        },
        {
            $group: { _id: { "assign_to": "$_id.assign_to", "productType": "$_id.productType" }, measures: { $push: { measure: '$_id.measure', qty: { $sum: "$qty" } } } }
        },
        {
            $match: {
                "_id.assign_to": mongoose.Types.ObjectId(provider)
            }
        },
        {
            $project: {
                _id: 0,

                "measures": 1,
                "product": "$_id.productType",
            }
        }
    ], function(err, supplies) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        }
        return next(null, {
            supplies: supplies
        });
    });
}