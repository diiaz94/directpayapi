var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ReceiptSchema = new Schema({
    name: String,
    photo_url: String,
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