var Region = require('../schemas/region');

exports.list = function(next) {
	Region.find({}, function(err, regions) {
		if (err) {
			return next({
				name: "INTERNAL_ERROR",
				extra: err
			});
		} else {
			return next({
				regions: regions
			});
		}
	})
}