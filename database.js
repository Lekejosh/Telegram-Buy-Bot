const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  userId: String,
  firstName: String,
  userName: String,
  chatId: String,
  status: String,
});
const User = mongoose.model("user", userSchema);

module.exports = User;
