var User = require('../schemas/user');
var CTS = require('../utils/constants');
var mongoose = require('mongoose');

function isEmail(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

exports.signup = function(email, password, name, next) {

    if (!email || !password || !name) {
        return next({
            name: "MISSING_REQUIRED_FIELDS"
        })
    }

    email = email.toLowerCase();
    User.findOne({
        email
    }, function(err, user) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        }
        if (user) {
            return next({
                name: "EMAIL_ALREADY_EXIST"
            });
        }
        if (password.length < CTS.MIN_PASSWORD_LENGTH) {
            return next({
                name: "PASSWORD_TOO_SHORT"
            });
        }
        var user = new User({
            email: email,
            password: password,
            profile: {
                name: name
            }
        });

        user.save(function(err, user) {
            if (err) {
                return next({
                    name: "INTERNAL_ERROR",
                    extra: err
                });
            }
            return next(null, {
                user: user
            });
        });
    });
}

exports.signin = function(email, password, next) {

    if (!email || !password) {
        return next({
            name: "MISSING_REQUIRED_FIELDS"
        });
    }

    User.findOne({
        email
    }, function(err, user) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        }
        if (!user) {
            return next({
                name: "BAD_CREDENTIALS"
            });
        }
        user.comparePassword(password, function(err, isMach) {
            if (err) {
                return next({
                    name: "INTERNAL_ERROR",
                    extra: err
                });
            }
            if (!isMach) {
                return next({
                    name: "BAD_CREDENTIALS"
                });
            }
            return next(null, {
                user: user
            });
        });
    });
}

exports.get = function(id, next) {

    if (!id) {
        return next({
            name: "MISSING_REQUIRED_FIELDS"
        });
    }

    var match = isEmail(id) ? {
        email: id
    } : {
        _id: id
    };

    User.findOne(match, function(err, user) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        } else if (user) {
            return next(null, {
                user: user
            });
        } else {
            return next({
                name: "USER_NOT_EXIST"
            });
        }
    });
}

exports.list = function(match, next) {

    if (!match) {
        return next({
            name: "MISSING_REQUIRED_FIELDS"
        });
    }

    User.find(match, function(err, users) {
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

    var newUser = new User(attrs);
    User.findOne({
        email: attrs.email
    }, function(err, user) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        } else if (user) {
            return next({
                name: "USER_ALREADY_EXIST"
            });
        } else {
            newUser.save(function(err, result) {
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
    });
}

exports.delete = function(user, next) {
    if (!user) {
        return next({
            name: "MISSING_REQUIRED_FIELDS"
        });
    }
    User.update({
        _id: user
    }, {
        $set: {
            status: 'deleted'
        }
    }, {
        runValidators: true
    }, function(err, modified) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        } else if (modified.nModified) {
            return next(null, {
                modified: modified
            });
        } else {
            return next({
                name: "INTERNAL_UKNOW_ERROR"
            });
        }
    });
}


exports.recentCustomers = function(lastDays, next) {
    User.count({
        created_at: {
            $gt: new Date((new Date()).getTime() - (lastDays * 24 * 60 * 60 * 1000))
        },
        status: 'active',
        'profile.role': 'customer'
    }, function(err, count) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        } else {
            return next(null, count);
        }
    });
}


exports.distribution = function(next) {
    User.aggregate([{
        $group: {
            _id: "$profile.role",
            role: {
                $first: "$profile.role"
            },
            count: {
                $sum: 1
            }
        }
    }, {
        $match: {
            _id: {
                $ne: null
            }
        }
    }, {
        $project: {
            _id: 0,
            count: 1,
            role: 1
        }
    }], function(err, result) {
        if (err) {
            return next({
                name: "INTERNAL_ERROR",
                extra: err
            });
        } else {
            return next(null, result);
        }
    });

}