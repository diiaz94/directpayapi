var User = require('../models/user');

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