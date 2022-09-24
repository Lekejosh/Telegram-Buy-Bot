const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    chatId: { type: String },
    groupName: { type: String },
    updateId: { type: Number },
    adminList: [{  }],
  },
);
const Group = mongoose.model("group", groupSchema);

module.exports = Group;
