'use strict';
var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema;

var phones = new Schema({
  number: { type: String },
  type: { type: String, enum: ['mobile', 'home', 'work'] }
});
var Profile = new Schema({
  userId: { type: String, required: true},
  firstName: {type: String},
  lastName: {type: String},
  gender: {type: String},
  birthday: {type: String},
  website: {type: String},
  country: { type: String },
  city: {type: String },
  address: {type: String },
  zip: {type: String },
  phones: [phones]
});

if (!Profile.options.toObject) Profile.options.toObject = {};
Profile.options.toObject.transform = transform;

module.exports = mongoose.model('UserProfile', Profile);

function transform(doc, ret, options) {
  delete ret.__v;
  delete ret._id;
  delete ret.userId;
}