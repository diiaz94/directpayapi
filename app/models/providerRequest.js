var ProviderRequest = require('../schemas/providerRequest');

exports.list = function(query, next) {

	if (!query.status) {
		query['status'] = {
			$ne: 'deleted'
		};
	}

	ProviderRequest.aggregate([{
		$match: query
	}, {
		$lookup: {
			from: 'users',
			localField: 'user',
			foreignField: '_id',
			as: 'user'
		}
	}, {
		$unwind: '$user'
	}, {
		$match: {
			'user.status': 'active'
		}
	}], function(err, result) {
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


exports.update = function(admin, id, status, next) {

	if (!admin || !id) {
		return next({
			name: "MISSING_REQUIRED_FIELDsS"
		});
	}
	var set = {
		status: status
	}

	var key;
	if (status == "accepted")
		key = "accepted_by"
	if (status == "rejected")
		key = "rejected_by"
	if (status == "deleted")
		key = "deleted_by"

	set[key] = admin;

	ProviderRequest.update({
		_id: id
	}, {
		$set: set
	}, {
		runValidators: true
	}, function(err, modified) {
		if (err) {
			return next({
				name: "INTERNAL_ERROR",
				extra: err
			});
		} else if (modified.nModified) {
			return next(null, modified);
		} else {
			return next({
				name: "INTERNAL_UKNOW_ERROR"
			});
		}
	});
}

exports.latestProviderRequests = function(lastDays, next) {
	ProviderRequest.count({
		created_at: {
			$gt: new Date((new Date()).getTime() - (lastDays * 24 * 60 * 60 * 1000))
		},
		status: 'pending'
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