const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  userId: { type: String },
  firstName: { type: String },
  userName: { type: String },
  chatId: { type: String },
  // isAdmin: { type: String },
  // status: { type: String },
  // eUniswap: { type: String, unique: true },
  // ePancake: { type: String, unique: true },
  // eUniswapv3: { type: String, unique: true },
  // eBiswap: { type: String, unique: true },
  // eSushiswap: { type: String, unique: true },
  // ePyeswap: { type: String, unique: true },
  // eShibaswap: { type: String, unique: true },
  // eBusta: { type: String, unique: true },
  // bUniswap: { type: String, unique: true },
  // bPancake: { type: String, unique: true },
  // bUniswapv3: { type: String, unique: true },
  // bBiswap: { type: String, unique: true },
  // bSushiswap: { type: String, unique: true },
  // bPyeswap: { type: String, unique: true },
  // bShibaswap: { type: String, unique: true },
  // bBusta: { type: String, unique: true },
  ethAddress: { type: String, unique: true },
  bscAddress: { type: String, unique: true },
});
const User = mongoose.model("user", userSchema);

module.exports = User;
