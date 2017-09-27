var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    type: {
        type: String,
        enum: ['car_liquid', 'wheel_liquid', 'vacuum', 'towel', 'floor'],
        require: true
    },
    measure: {
        type: String,
        enum: ['unit', '250ml', '500ml', '5lt'],
        default: 'unit',
        require: true
    }
}, {
    _id: false
});
var SupplySchema = new Schema({
    assign_by: {
        type: Schema.Types.ObjectId,
        required: true
    },
    assign_to: {
        type: Schema.Types.ObjectId,
        required: true
    },
    product: ProductSchema,
    qty: {
        type: Number,
        default: 0,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Supply', SupplySchema);