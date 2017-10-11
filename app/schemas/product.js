var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProductSchema = new Schema({
    name: String,
    photo_url: String,
    price: Number,
    description: String,
    rating: Number,
    status: {
        type: String,
        enum: ['active', 'deleted', 'unavailable'],
        default: 'active'
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});



module.exports = mongoose.model('Product', ProductSchema);