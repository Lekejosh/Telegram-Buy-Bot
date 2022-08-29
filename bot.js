const { Telegraf } = require("telegraf");
const bot = new Telegraf("5605755705:AAFcqIVnFlN3r9LAxbWumf7_w05g7Cdapj8");
const axios = require("axios");

bot.command("start", (ctx) => {
  let startMessage =
    "Hello!\n 1) Please click the link below(Admins only). \n 2) Click the 'Start' Button at the bottom of the screen. \n 3) if you want to add a token to the group, choose 'Add Token', or; \n 4) if you want to changethe settings for an already added token, choose 'Change Token Settings'. \n \n You will need to click this link everytime you want to enter the menus~";
  bot.telegram.sendMessage(ctx.chat.id, startMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Click me",
            url: "https://t.me/BobbyBuyBot?start=-744283958",
          },
        ],
      ],
    },
  });
});

bot.launch();
