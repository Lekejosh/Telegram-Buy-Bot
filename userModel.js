const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // name: { type: String },
  // userId: { type: String },
  // firstName: { type: String },
  // userName: { type: String },
  chatId: { type: String, unique: true },
  ethAddress: [{ name: String, token_Address: String }],
  bscAddress: [{ name: String, token_Address: String }],
  telegram: String,
  step: String,
  cSupply: String,
  emoji: String,
  mEnable: String,
  mImage: String,
});
const User = mongoose.model("user", userSchema);

module.exports = User;
