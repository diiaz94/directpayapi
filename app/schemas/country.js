var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CountrySchema = new Schema({
	iso: {
		type: String,
		unique: true,
		required: true,
	},
	name: String,
	area_code: String,
	nationality: String,
	status: {
		type: String,
		enum: ['active', 'inactive', 'deleted'],
		default: 'active'
	}
});


module.exports = mongoose.model('Country', CountrySchema);