var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommerceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    short_description: {
        type: String
    },
    photo_url: {
        type: String
    },
    beacon: {
        type: Schema.Types.ObjectId,
        ref: 'Beacon'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'deleted'],
        default: 'active'
    }
});


module.exports = mongoose.model('Country', CommerceSchema);