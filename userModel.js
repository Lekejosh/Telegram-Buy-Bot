const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  userId: { type: String },
  firstName: { type: String },
  userName: { type: String },
  chatId: { type: String, unique: true },
  isAdmin: { type: String },
  status: { type: String },
  eUniswap: { type: String },
  ePancake: { type: String },
  eUniswapv3: { type: String },
  eBiswap: { type: String },
  eSushiswap: { type: String },
  ePyeswap: { type: String },
  eShibaswap: { type: String },
  eBusta: { type: String },
  bUniswap: { type: String },
  bPancake: { type: String },
  bUniswapv3: { type: String },
  bBiswap: { type: String },
  bSushiswap: { type: String },
  bPyeswap: { type: String },
  bShibaswap: { type: String },
  bBusta: { type: String },
});
const User = mongoose.model("user", userSchema);

module.exports = User;
