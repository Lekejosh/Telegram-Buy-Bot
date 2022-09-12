const transaction = require("./crypt");
const User = require("../userModel");

class Bot {
  constructor(bot) {
    this.bot = bot;
    this.transaction = new transaction();
  }

  // Replace the "-1001573064067" with your chatId from your database

  // Send Alert message

  sendMessages(message) {
    for (let i = 0; i < User.length; i++) {
      User.find((error, data) => {
        if (error) {
          console.log("error getting User info");
        } else {
          for (let j = 0; j < data[i]?.ethAddress?.length; j++) {
            console.log(data[i]?.chatId);
            console.log(data[i]?.ethAddress[j]?.token_Address);
            this.bot.telegram.sendMessage(data[i]?.chatId, message, {
              parse_mode: "HTML",
              disable_web_page_preview: true,
            });
          }
        }
      });
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
