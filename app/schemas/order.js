var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    receipt: {
        type: Schema.Types.ObjectId,
        ref: 'Receipt'
    },
    items: [{
        name: String,
        image_url: String,
        qty: Number,
        type: {
            type: String,
            enum: ['product', 'custom', 'deleted'],
        }
    }],
    total: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'deleted'],
        default: 'active'
    }
});


module.exports = mongoose.model('Order', OrderSchema);