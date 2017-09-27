var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var User = require('../schemas/user');
var ProviderRequest = require('../schemas/providerRequest');
var config = require('../../config/main').get(process.env.NODE_ENV);
var CTS = require('../utils/constants');
var util = require('../utils/util');
const SECRET = config.secret;
var https = require('https');

function generateToken(user) {
  return jwt.sign(user, SECRET, {
    expiresIn: '365d'
  });
}


exports.acountsFacebook = function(req, res) {
  var token = req.body.token;
  if (!token) {
    return util.errorResponse(res, 'MISSING_REQUIRED_FIELDS', {
      fields: "token"
    });
  }

  var url = "https://graph.facebook.com/v2.5/me?access_token=" + token + "&fields=id,first_name,last_name,email";
  console.log("url", url)
  https.get(url, function(resp) {

    resp.on("data", function(d) {
      try {
        var response = JSON.parse(d.toString());
        if (response.error) {
          return util.errorResponse(res, 'FACEBOOK_ERROR', err);
        }
        console.log("response", response)
        if (!response.first_name || !response.last_name || !response.email) {
          return util.errorResponse(res, 'FACEBOOK_FIELDS_AUTHENTICATE');
        }

        User.findOne({
          email: response.email
        }, function(err, user) {

          if (err) {
            return util.errorResponse(res, 'INTERNAL_ERROR', err);
          }
          if (user) {
            return util.okResponse(res, resp.statusCode, {
              token: generateToken(user),
              user: user
            });
          } else {
            var newUser = new User({
              email: response.email,
              name: response.first_name,
              last_name: response.last_name,
              facebook_id: response.id
            });
            newUser.save(function(err, user) {
              if (err) {
                return util.errorResponse(res, 'INTERNAL_ERROR', err);
              }
              return util.okResponse(res, resp.statusCode, {
                token: generateToken(user),
                user: user
              });
            });
          }
        })

      } catch (err) {
        console.log(err)
        return util.errorResponse(res, 'INTERNAL_ERROR', err);
      }
    });

    resp.on("error", function(err) {
      return util.errorResponse(res, 'INTERNAL_ERROR', err);
    });
  });
}

exports.signup = function(req, res) {
  var role = req.body.role == "provider" ? req.body.role : "customer";

  var name = req.body.name;
  var lastName = req.body.last_name;
  var phone = req.body.phone;
  var email = req.body.email;
  var rut = req.body.rut;
  var password = req.body.password;
  var agree = req.body.agree;

  var birth = role == "provider" ? req.body.birth : undefined;
  var country = role == "provider" ? req.body.country : undefined;
  var schedule = role == "provider" ? req.body.schedule : undefined;
  var address = role == "provider" ? req.body.address : undefined;
  var communes = role == "provider" ? req.body.communes : undefined;
  var motivation = role == "provider" ? req.body.motivation : undefined;
  var avatar_url = role == "provider" ? req.body.avatar_url : undefined;
  var background_url = role == "provider" ? req.body.background_url : undefined;
  var ci_anv_url = role == "provider" ? req.body.ci_anv_url : undefined;
  var ci_rev_url = role == "provider" ? req.body.ci_rev_url : undefined;
  var cv_url = role == "provider" ? req.body.cv_url : undefined;

  if (!email || !password || !name || !agree) {
    return util.errorResponse(res, 'MISSING_REQUIRED_FIELDS');
  }

  if (role == "provider") {
    if (!birth || !country || !schedule || !address || !communes || !avatar_url || !background_url || !ci_anv_url || !ci_rev_url || !cv_url) {
      return util.errorResponse(res, 'MISSING_REQUIRED_FIELDS', {
        requeried_fields: "birth,country,schedule,address,communes,avatar_url,background_url,ci_anv_url,ci_rev_url,cv_url",
        fields: req.body
      });
    }
  }


  User.findOne({
      $or: [{
        'email': email.trim().toLowerCase()
      }, {
        'profile.rut': rut
      }]
    },
    function(err, user) {
      if (err) {
        return util.errorResponse(res, 'INTERNAL_ERROR', err);
      }
      if (user) {
        return util.errorResponse(res, 'USER_ALREADY_EXIST');
      }

      if (rut.length < CTS.MIN_RUT_LENGTH) {
        return util.errorResponse(res, 'RUT_TOO_SHORT');
      }
      if (password.length < CTS.MIN_PASSWORD_LENGTH) {
        return util.errorResponse(res, 'PASSWORD_TOO_SHORT');
      }

      var user = new User({
        email: email,
        password: password,
        profile: {
          role: role == 'provider' ? role : 'customer',
          name: name,
          last_name: lastName,
          phone: phone,
          birth: birth,
          country: country,
          schedule: schedule,
          address: address,
          communes: communes,
          motivation: motivation,
          avatar_url: avatar_url,
          background_url: background_url,
          ci_anv_url: ci_anv_url,
          ci_rev_url: ci_rev_url,
          cv_url: cv_url,
          rut: rut,
          agree: agree,
        }
      });
      user.save(function(err, user) {
        if (err) {
          return util.errorResponse(res, 'INTERNAL_ERROR', err);
        }
        checkProviderRole(user, function(err, request) {
          if (err) {
            return util.errorResponse(res, 'INTERNAL_ERROR', err);
            user.remove();
          }
          return util.okResponse(res, 201, {
            token: generateToken(user),
            user: user
          });
        });
      });
    });
}


exports.signin = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;

  if (!req.body.email || !req.body.password) {
    return util.errorResponse(res, 'MISSING_REQUIRED_FIELDS');
  }

  User.findOne({
    email: email.trim().toLowerCase()
  }, function(err, user) {
    if (err) {
      return util.errorResponse(res, 'INTERNAL_ERROR', err);
    }
    if (!user) {
      return util.errorResponse(res, 'USER_NOT_EXIST');
    }
    user.comparePassword(password, function(err, isMach) {
      if (err) {
        return util.errorResponse(res, 'INTERNAL_ERROR', err);
      }
      if (!isMach) {
        return util.errorResponse(res, 'BAD_CREDENTIALS');
      }
      return util.okResponse(res, 200, {
        token: generateToken(user),
        user: user
      });
    });
  });
};

exports.signout = function(req, res) {

  return util.okResponse(res, 200, {
    message: "Cierre de sesión exitoso",
    user: user
  });
}

function checkProviderRole(user, next) {
  if (user.profile.role == "provider") {
    var providerRequest = ProviderRequest({
      user: user._id
    });

    providerRequest.save(function(err, request) {
      if (err) return next(err);
      return next(null, request);
    })
  } else {
    return next();
  }
}