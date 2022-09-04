const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // name: { type: String },
  // userId: { type: String },
  // firstName: { type: String },
  // userName: { type: String },
  chatId: { type: String, unique: true },
  ethAddress: [{ name: String, token_Address: String }],
  bscAddress: [{ name: String, token_Address: String }],
});
const User = mongoose.model("user", userSchema);

module.exports = User;
