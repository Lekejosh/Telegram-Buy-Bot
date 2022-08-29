const { Telegraf } = require("telegraf");
const bot = new Telegraf("5605755705:AAFcqIVnFlN3r9LAxbWumf7_w05g7Cdapj8");
const axios = require("axios");

bot.command("start", (ctx) => {
  let startMessage = "Welcome, This Bot is a Buy ";
  bot.telegram.sendMessage(ctx.chat.id, startMessage, {
    reply_markup: {
      inline_keybord: [
        [{ text: "Test Message", callback_data: "Price" }],
        [
          {
            text: "CoinMarketCap",
            url: "https://coinmarketcap.com",
          },
        ],
      ],
    },
  });
});

bot.launch();
