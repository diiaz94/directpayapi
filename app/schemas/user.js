var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: String,
    photo_url: String,
    status: {
        type: String,
        enum: ['active', 'deleted'],
        default: 'active'
    },
    role: {
        type: String,
        enum: ['customer', 'commerce'],
        default: 'customer'
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('User', UserSchema);