const transaction = require("./crypt");

const User = require("../userModel");

class Bot {
  constructor(bot) {
    this.bot = bot;
    this.transaction = new transaction();
  }

 

  // Replace the "-1001573064067" with your chatId from your database

  // Send Alert message

  async sendMessages(message) {
    let user = await User.find()
    

    for(let i =0; i<user.length;i++){
      console.log("chatId", user[i].chatId);
      if (
        user[i].mImage == "Not set" ||
        user[i].mImage == undefined ||
        user[i].mImage == null
      ) {
        this.bot.telegram.sendMessage(-685910650, message, {
          parse_mode: "HTML",
          disable_web_page_preview: true,
        });
      } else {
        this.bot.telegram.sendPhoto(-685910650, `${user[i].mImage}`, {
          caption: message,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        });
      }
    }
  
  }

  async watchChanges() {
    try {
      await Promise.all([
        this.transaction.getTransaction(this.sendMessages.bind(this)),
      ]);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Bot;
