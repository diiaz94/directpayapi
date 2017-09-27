var Country = require('../schemas/country');

exports.list = function(next) {

	Country.find({
		status: 'active'
	}).sort({
		nationality: 1
	}).exec(function(err, countries) {
		if (err) {
			return next({
				name: "INTERNAL_ERROR",
				extra: err
			});
		} else {
			return next(null, countries);
		}
	})
}