var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CommuneSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ['active', 'inactive', 'deleted'],
		default: 'active'
	}
});


var ProvinceSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ['active', 'inactive', 'deleted'],
		default: 'active'
	},
	communes: [CommuneSchema]
});


var RegionSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true,
	},
	status: {
		type: String,
		enum: ['active', 'inactive', 'deleted'],
		default: 'active'
	},
	provinces: [ProvinceSchema]
});


module.exports = mongoose.model('Region', RegionSchema);