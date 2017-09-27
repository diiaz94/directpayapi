var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var CustomerRequestSchema = new Schema({
  take_by: type: Schema.Types.ObjectId,
  made_by: type: Schema.Types.ObjectId,
  address: type: String,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'canceled', 'finish'],
    default: 'pending'
  },
  loc: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: type: [Number]
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('CustomerRequestSchema', CustomerRequestSchema);
