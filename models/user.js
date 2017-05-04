const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Number },
  updated_at: { type: Number }
})

userSchema.pre('save', function(next) {

  var currentDate = Date.now();

  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

let User = mongoose.model('User', userSchema);

module.exports = User;
