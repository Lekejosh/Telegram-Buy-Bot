const { Telegraf, ctx } = require("telegraf");
const bot = new Telegraf("5561811963:AAFV83oL535KmiZOHwkSIybgiwmoCAxUCxQ");
const axios = require("axios");
const text = require("./text.json");

bot.use(function (ctx, next) {
  /// or other chat types...
  // if( ctx.chat.type !== 'channel' ) return next();
  if (ctx.chat.id > 0) return next();
  console.log(ctx.chat.title);

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

bot.start((ctx) => {
  if (ctx.from._is_in_admin_list) {
    bot.telegram.sendMessage(ctx.chat.id, text.welcome, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Click me",
              callback_data: "setting",
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

// function (ctx,next) {

//   let id = ctx.from.id;
//   bot.command(`start=${id}`, (ctx) => {
//     if (id === ctx.from.id) {
//       return ctx.reply("welcome");
//     } else {
//       return ctx.reply("denied");
//     }
//   });

// }

// bot.command(`/start/${ctx.chat.id}`, async (ctx) => {
//   try {
//     await ctx.reply();
//   } catch (error) {}
// });

bot.action("setting", function (ctx) {
  if (ctx.from._is_in_admin_list) {
    let startMessage = `What are you will to set today? `;
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

// bot.action(redirect, (ctx) => {
//   let startMessage = "Welcome what will you like to do today?";
//   if (id === ctx.from.id) {
//     return ctx.reply("welcome");
//   } else {
//     return ctx.reply("denied");
//   }
// bot.telegram.sendMessage(ctx.chat.id, startMessage, {
//   reply_markup: {
//     inline_keyboard: [
//       [
//         {
//           text: "Click me",
//           url: "https://t.me/leke_tut_buyBot",
//         },
//       ],
//       [{ text: "Setting(Admin Only)", callback_data: "setting" }],
//     ],
//   },
// });
// });

bot.launch();
