'use strict';
var mongoose          = require('mongoose'),
    Schema            = mongoose.Schema,
    crypto            = require('crypto'),
    uuid              = require('node-uuid');

var User = new Schema({
  username: { type: String, unique: true, required: true },
  hashedPassword: { type: String, required: true },
  salt: {type: String, required: true},
  token: {type: String, unique: true, required: true},
  created: { type: Date, default: Date.now }
});

if (!User.options.toObject) User.options.toObject = {};
User.options.toObject.transform = transform;

User.pre('validate', beforeValidate);

User.virtual('userId').get(function () {return this._id;});
User.virtual('password')
    .set(setPassword)
    .get(function() { return this._plainPassword; });

User.methods.encryptPassword = encryptPassword;
User.methods.checkPassword = checkPassword;
User.methods.generateToken = generateToken;

module.exports = mongoose.model('User', User);

function checkPassword(password){
  return this.encryptPassword(password) === this.hashedPassword;
}
function encryptPassword(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}
function setPassword(password) {
  this._plainPassword = password;
  this.salt = crypto.randomBytes(32).toString('hex');
  this.hashedPassword = this.encryptPassword(password);
}
function beforeValidate(next) {
  if(this.isNew){
    this.generateToken();
  }
  next();
}
function generateToken() {
  this.token = uuid.v4();
}

function transform(doc, ret, options) {
  delete ret.__v;
  delete ret._id;
  delete ret.hashedPassword;
  delete ret.salt;
  delete ret.token;
}