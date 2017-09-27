var jwt = require('jsonwebtoken');
var config = require('../../config/main').get(process.env);
var SECRET = config.secret;
var User = require('../models/user');
var util = require('../utils/util');


exports.authenticate = function(req, res, next) {
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, SECRET, function(err, decoded) {
      if (err) {
        return util.errorResponse(res, 'AUTHENTICATE_FAILED', err);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return util.errorResponse(res, 'NO_TOKEN_PROVIDED');
  }
}

exports.admin = function(req, res, next) {
  if (req.decoded._doc.profile.role != 'admin')
    return util.errorResponse(res, 'UNAUTHORIZATED');
  else
    next();
}

exports.provider = function(req, res, next) {
  if (req.decoded._doc.profile.role != 'provider')
    return util.errorResponse(res, 'UNAUTHORIZATED');
  else
    next();
}

exports.customer = function(req, res, next) {
  if (req.decoded._doc.profile.role != 'customer')
    return util.errorResponse(res, 'UNAUTHORIZATED');
  else
    next();
}