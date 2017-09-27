var multer = require('multer');
var User = require('../models/user');
var Supply = require('../models/supply');
var util = require('../utils/util');

exports.list = function(req, res) {
    User.list({
        status: 'active'
    }, function(err, users) {
        if (err) {
            return util.errorResponse(res, err.name, err.extra);
        }
        return util.okResponse(res, 200, {
            users: users
        });
    });
};

exports.createAdmin = function(req, res) {
    var user = req.decoded._doc._id;
    var email = req.body.email;
    var password = req.body.password
    var name = req.body.name;
    var lastName = req.body.last_name;

    User.add({
        email: email,
        password: password,
        created_by: user,
        'profile.name': name,
        'profile.last_name': lastName,
        'profile.role': 'admin'
    }, function(err, data) {
        if (err) {
            return util.errorResponse(res, err.name, err.extra);
        }
        return util.okResponse(res, 201, {
            data: data
        });
    });
};

exports.delete = function(req, res) {
    var user = req.query.user_id ? req.query.user_id : req.body.user_id;

    User.delete(user, function(err, data) {
        if (err) {
            return util.errorResponse(res, err.name, err.extra);
        }
        return util.okResponse(res, 200, {
            message: "Usuario eliminado satisfactoriamente."
        });
    });
}

exports.detail = function(req, res) {
    var id = req.query.id;

    if (!id) {
        return util.errorResponse(res, "MISSING_REQUIRED_FIELDS");
    }

    User.get(id, function(err, result) {
        if (err) {
            return util.errorResponse(res, err.name, err.extra);
        }
        var user = result.user;
        if (user.profile.role == "provider") {
            Supply.providerSupplies(user._id, function(err, result) {

                var supplies = result ? result.supplies : []
                return util.okResponse(res, 200, {
                    user: user,
                    supplies: supplies
                });
            });
        } else {
            return util.okResponse(res, 200, {
                user: user
            });
        }
    });
}