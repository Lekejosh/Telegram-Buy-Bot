const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const { session } = require("telegraf-session-mongoose");
const text = require("./text.json");

const bot = new Telegraf("5605755705:AAFcqIVnFlN3r9LAxbWumf7_w05g7Cdapj8");

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
              url: `t.me/leke_tut_buyBot?start=${ctx.chat.id}`,
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
