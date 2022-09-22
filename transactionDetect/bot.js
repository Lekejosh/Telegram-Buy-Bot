const {
  transaction,
  ID,
  image
} = require("./crypt");

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
    

 
      console.log("chatId", ID);
      if (
        image[0] == "Not Set" ||
        image[0] == undefined ||
        image[0] == null
      ) {
        this.bot.telegram.sendMessage(ID[0], message, {
          parse_mode: "HTML",
          disable_web_page_preview: true,
        });
      } else {
        this.bot.telegram.sendPhoto(ID[0], `${image[0]}`, {
          caption: message,
          parse_mode: "HTML",
          disable_web_page_preview: true,
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
