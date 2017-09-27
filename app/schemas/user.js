var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var profileSchema = new Schema({
  role: {
    type: String,
    enum: ['customer', 'provider', 'admin'],
    default: 'customer'
  },
  name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  phone: String,
  birth: Date, //waasher
  rut: {
    type: String,
    required: function() {
      return this.role != 'admin';
    }
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country'
  },
  schedule: [String], //waasher
  address: String, //waasher
  communes: [{
    type: Schema.Types.ObjectId,
    ref: 'Commune'
  }], //waasher
  motivation: String, //waasher
  avatar_url: String, //waasher
  background_url: String, //waasher
  ci_anv_url: String, //waasher
  ci_rev_url: String, //waasher
  cv_url: String, //waasher
  agree: Boolean
}, {
  _id: false
});

var UserSchema = new Schema({
  profile: profileSchema,
  created_by: {
    type: Schema.Types.ObjectId
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Incorrect format email address.']
  },
  password: {
    type: String
  },
  type: {
    type: String,
    enum: ['user', 'tester', 'admin'],
    default: 'user'
  },
  profile_complete: {
    type: Boolean,
    default: false
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'block', 'deleted'],
    default: 'active'
  },
  facebook_id: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

UserSchema.statics.profile = function(user, next) {

}

UserSchema.pre('save', function(next) {
  var user = this;
  if (this.isModified('password' || this.IsNew)) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err)
      }
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err)
        }
        user.password = hash;
        next();
      })
    })
  } else {
    return next();
  }
});

UserSchema.methods.comparePassword = function(password, next) {
  bcrypt.compare(password, this.password, function(err, isMach) {
    if (err) {
      return next(err);
    }
    next(null, isMach);
  })
}


module.exports = mongoose.model('User', UserSchema);