var Supply = require('../models/supply');
var util = require('../utils/util');

exports.assign = function(req, res) {
    var assignBy = req.decoded._doc._id;
    var assignTo = req.body.provider;
    var productType = req.body.product_type;
    var measure = req.body.measure;
    var qty = req.body.qty;
    console.log(req.body, assignBy)
    if (!assignBy || !assignTo || !productType || !qty) {
        return util.errorResponse(res, "MISSING_REQUIRED_FIELDS");
    }

    Supply.add({
        assign_by: assignBy,
        assign_to: assignTo,
        product: {
            type: productType,
            measure: measure
        },
        qty: qty
    }, function(err, data) {
        if (err) {
            return util.errorResponse(res, err.name, err.extra);
        }
        return util.okResponse(res, 201, {
            data: data
        });
    });

}

exports.types = function(req, res) {

    util.okResponse(res, 200, {
        product_types: [
            { key: 'car_liquid', value: 'Liquido para auto', mesaures: ['250ml', '500ml', '5lt'] },
            { key: 'wheel_liquid', value: 'Liquido para llantas', mesaures: ['250ml', '500ml', '5lt'] },
            { key: 'vacuum', value: 'Aspiradora para interior', mesaures: ['unit'] },
            { key: 'towel', value: 'Toallas de limpieza (Paquetes de 10 unidades)', mesaures: ['unit'] },
            { key: 'floor', value: 'Piso pequeño', mesaures: ['unit'] }
        ]
    });
}