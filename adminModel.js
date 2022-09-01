const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  userId: String,
  firstName: String,
  userName: String,
  chatId: { String, unique: true },
  isAdmin: String,
  status: String,
  eUniswap: String,
  ePancake: String,
  eUniswapv3: String,
  eBiswap: String,
  eSushiswap: String,
  ePyeswap: String,
  eShibaswap: String,
  eBusta: String,
  bUniswap: String,
  bPancake: String,
  bUniswapv3: String,
  bBiswap: String,
  bSushiswap: String,
  bPyeswap: String,
  bShibaswap: String,
  bBusta: String,
});
const User = mongoose.model("user", userSchema);

module.exports = User;
