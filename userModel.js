const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  chatId: { type: String, unique: true },
  ethAddress: [{ name: String, token_Address: String }],
  bscAddress: [{ name: String, token_Address: String }],
  telegram: { type: String },
  step: { type: Number },
  cSupply: { type: Number },
  emoji: { type: String },
  mEnable: { type: Boolean },
  pairAddress:{type: String},
  mImage: {
    data: Buffer,
    contentType: String,
  },
  timeStamp:{type: Number}
});
const User = mongoose.model("user", userSchema);

module.exports = User;
