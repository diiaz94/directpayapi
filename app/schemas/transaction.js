var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TransactionSchema = new Schema({
    seller: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    buyer: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        qty: {
            type: Number,
            require: true,
            default: 1
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'progress', 'finish'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['sale', 'buy']
    },
    pay_type: {
        type: String,
        enum: ['tdc', 'pre']
    },
    total_amount: String,
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});



module.exports = mongoose.model('User', UserSchema);