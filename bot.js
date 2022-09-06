const transaction = require("./blockchain transaction/crypt");
// const bsctransaction = require("./blockchain transaction/bsccrypt");
class Bot {
  constructor(bot) {
    this.bot = bot;
    this.transaction = new transaction();
    // this.bsctransaction = new bsctransaction();
  }

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
