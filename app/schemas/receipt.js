var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ReceiptSchema = new Schema({
    sent_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    sent_to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    photo_url: String,
    type: {
        type: String,
        enum: ['order', 'ticket']
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'deleted'],
        default: 'pending'
    },
    description: String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Receipt', ReceiptSchema);