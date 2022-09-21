const transaction = require("./crypt");

const User = require("../userModel");
 console.log();

class Bot {
  constructor(bot) {
    this.bot = bot;
    this.transaction = new transaction();
  }

 

  // Replace the "-1001573064067" with your chatId from your database

  // Send Alert message

  sendMessages(message) {
            this.bot.telegram.sendMessage(-685910650, message, {
              parse_mode: "HTML",
              disable_web_page_preview: true,
            });
  
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
