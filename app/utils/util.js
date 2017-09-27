var CTS = require('./constants');
var fs = require('fs');

exports.okResponse = function(res, httpCode, response) {
  return res.status(httpCode).json({
    success: true,
    response: response
  })
}
exports.errorResponse = function(res, id, extra) {
  var error = CTS.ERRORS[id];
  error = error ? error : CTS.DEFAULT_ERROR;

  return res.status(error.httpCode).json({
    success: false,
    error: {
      id: id,
      code: error.code,
      description: error.description,
      extra: extra
    }
  })
}

exports.stringFromFile = function(filePath, next) {
  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) {
      next(err, null);
    }
    next(null, data);
  });
}