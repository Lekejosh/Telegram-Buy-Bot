const { Telegraf } = require("telegraf");
const bot = new Telegraf("5605755705:AAFcqIVnFlN3r9LAxbWumf7_w05g7Cdapj8");
const axios = require("axios");

function getName(user) {
  return user.username; // this always exists
}

bot.use(function (ctx, next) {
  /// or other chat types...
  // if( ctx.chat.type !== 'channel' ) return next();
  if (ctx.chat.id > 0) return next();

  /// need to cache this result ( variable or session or ....)
  /// because u don't need to call this method
  /// every message
  return bot.telegram
    .getChatAdministrators(ctx.chat.id)
    .then(function (data) {
      if (!data || !data.length) return;
      console.log("admin list:", data);
      ctx.chat._admins = data;
      ctx.from._is_in_admin_list = data.some(
        (adm) => adm.user.id === ctx.from.id
      );
    })
    .catch(console.log)
    .then((_) => next(ctx));
});
bot.command("start", function (ctx) {
  if (ctx.from._is_in_admin_list) {
    let startMessage =
      "Hello!\n 1) Please click the link below(Admins only). \n 2) Click the 'Start' Button at the bottom of the screen. \n 3) if you want to add a token to the group, choose 'Add Token', or; \n 4) if you want to changethe settings for an already added token, choose 'Change Token Settings'. \n \n <i>You will need to click this link everytime you want to enter the menus</i>";
    bot.telegram.sendMessage(ctx.chat.id, startMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Click me",
              url: "https://t.me/leke_tut_buyBot",
            },
          ],
        ],
      },
    });
  } else {
    return ctx.reply("Only Admin can access this", {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});

bot.action("setting", function (ctx) {
  if (ctx.from._is_in_admin_list) {
    let startMessage = `What are you will to set today?`;
    bot.telegram.sendMessage(ctx.chat.id, startMessage, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Reset Token",
              url: "https://t.me/leke_tut_buyBot",
            },
          ],
          [{ text: "Back", callback_data: "start" }],
        ],
      },
    });
  } else {
    return ctx.reply("Only Admin can access this");
  }
});
bot.action("start", (ctx) => {
  let startMessage =
    "Hello!\n 1) Please click the link below(Admins only). \n 2) Click the 'Start' Button at the bottom of the screen. \n 3) if you want to add a token to the group, choose 'Add Token', or; \n 4) if you want to changethe settings for an already added token, choose 'Change Token Settings'. \n \n You will need to click this link everytime you want to enter the menus~";
  bot.telegram.sendMessage(ctx.chat.id, startMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Click me",
            url: "https://t.me/leke_tut_buyBot",
          },
        ],
        [{ text: "Setting(Admin Only)", callback_data: "setting" }],
      ],
    },
  });
});
bot.launch();
