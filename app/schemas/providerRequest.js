var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProviderRequestSchema = new Schema({
	accepted_by: {
		type: Schema.Types.ObjectId,
	},
	rejected_by: {
		type: Schema.Types.ObjectId,
	},
	deleted_by: {
		type: Schema.Types.ObjectId,
	},
	user: {
		type: Schema.Types.ObjectId,
		require: true,
		ref: 'User'
	},
	status: {
		type: String,
		enum: ['pending', 'accepted', 'rejected', 'deleted'],
		default: 'pending'
	}
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});

module.exports = mongoose.model('ProviderRequest', ProviderRequestSchema);