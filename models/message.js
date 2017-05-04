const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let messageSchema = new Schema({
  msg: { type: String, required: true },
  user: {
  	username: { type: String, required: true }
  },
  chatId: { type: Number, required: true },
  created_at: { type: Number },
  updated_at: { type: Number }
})

messageSchema.pre('save', function(next) {

  var currentDate = Date.now();

  this.updated_at = currentDate;

  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

let Message = mongoose.model('Message', messageSchema);

module.exports = Message;