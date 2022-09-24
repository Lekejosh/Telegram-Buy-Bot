const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    chatId: { type: String },
    groupName: { type: String },
    adminList: [{ userId: Number, status: String }],
  },
);
const Group = mongoose.model("group", groupSchema);

module.exports = Group;
