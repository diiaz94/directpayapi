var ProviderRequest = require('../models/providerRequest');
var util = require('../utils/util');

exports.list = function(req, res) {
	ProviderRequest.list(req.query, function(err, requests) {
		if (err) {
			return util.errorResponse(res, err.name, err.extra);
		}
		return util.okResponse(res, 200, {
			requests: requests
		});
	});
}

exports.updateStatus = function(req, res) {
	ProviderRequest.update(req.decoded._doc._id, req.body.request_id, req.body.status, function(err, request) {
		if (err) {
			return util.errorResponse(res, err.name, err.extra);
		}
		return util.okResponse(res, 200, {
			message: "Solicitud actualizada satisfactoriamente."
		});
	});
}