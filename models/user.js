const mongoose = require("mongoose");

mongoose.connect('mongodb://test_api:111111@ds029381.mlab.com:29381/react-chat_db');

const Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: Date,
  updated_at: Date
})

userSchema.pre('save', function(next) {

  var currentDate = new Date();

  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

let User = mongoose.model('User', userSchema);

module.exports = User;
