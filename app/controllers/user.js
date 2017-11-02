var User = require('../models/user');
var util = require('../utils/util');

exports.list = function(req, res) {
    var user_id = req.query.user_id;
    var role = req.query.role;

    var obj = {};
    obj["status"] = "active";

    if (role)
        obj["role"] = role;

    User.list(obj, user_id, function(err, users) {
        if (err) {
            return util.errorResponse(res, err.name, err.extra);
        }
        return util.okResponse(res, 200, {
            users: users
        });
    });
};

exports.add = function(req, res) {

    User.add(req.body,
        function(err, result) {
            if (err) {
                return util.errorResponse(res, err.name, err.extra);
            }
            return util.okResponse(res, 201, result);
        });
};