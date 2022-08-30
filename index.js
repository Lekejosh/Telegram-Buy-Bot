const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const { session } = require("telegraf-session-mongoose");
const text = require("./text.json");

const bot = new Telegraf("5605755705:AAFcqIVnFlN3r9LAxbWumf7_w05g7Cdapj8");

const model = new mongoose.Schema({
  name: String,
  userName: String,
  userId: Number,
  chatId: Number,
  firstName: String,
  status: String,
});

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
  //   new model({
  //     name: ctx.from.first_name,
  //     userId: ctx.from.id,
  //     userName: ctx.from.username,
  //     chatId: ctx.chat.id,
  //     status: ctx.status,
  //   }).save();
  if (ctx.from.id && ctx.from._is_in_admin_list) {
    bot.telegram.sendMessage(ctx.chat.id, text.welcome, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Proceed",
              callback_data: "add",
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
bot.action("setting", (ctx) => {
  if (ctx.from._is_in_admin_list) {
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, text.setting, {
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
    return;
  }
});

bot.action("add", (ctx) => {
  if (ctx.from._is_in_admin_list) {
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, text.setting, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Add New Token",
              callback_data: "set",
            },
          ],
          [{ text: "Change token setting", callback_data: "setting" }],
        ],
      },
    });
  } else {
    return;
  }
});

bot.action("set", (ctx) => {
  if (ctx.from._is_in_admin_list) {
    ctx.deleteMessage();
    bot.telegram.sendMessage(
      ctx.chat.id,
      text.set + " " + `${ctx.chat.title}`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "ETH",
                callback_data: "eth",
              },
            ],
            [{ text: "BSC", callback_data: "bsc" }],
          ],
        },
      }
    );
  } else {
    return;
  }
});

bot.action("eth", (ctx) => {
  if (ctx.from._is_in_admin_list) {
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, text.token, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Uniswap",
              callback_data: "uniswap",
            },
          ],
        ],
      },
    });
  } else {
    return;
  }
});

// const redirect = (ctx) => {
//   if (ctx.chat.id && ctx.from._is_in_admin_list) {
//     bot.command(`start=${ctx.chat.id}`);
//     return ctx.reply(text.start);
//   } else {
//   }
// };
// redirect();

const init = async () => {
  mongoose.connect("mongodb://localhost:27017/telegram", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "telegram",
  });

  bot.use(session({ collectionName: "sessions" }));
  bot.launch();
};

init();
