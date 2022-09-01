const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const { session } = require("telegraf-session-mongoose");
const text = require("./text.json");
const User = require("./userModel");

const bot = new Telegraf("5561811963:AAFV83oL535KmiZOHwkSIybgiwmoCAxUCxQ");

bot.use(function (ctx, next) {
  if (ctx.chat.id > 0) return next();
  console.log(ctx.chat.title);

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

bot.command("addtoken", (ctx, next) => {
  User.findOne({ chatId: ctx.chat.id, userId: ctx.from.id }).then((user) => {
    if (user) {
      next();
    } else {
      const newUser = User.create({
        firstName: ctx.from.first_name,
        userId: ctx.from.id,
        chatId: ctx.chat.id,
      }).then((neww) => {
        console.log(neww);
      });
    }
  });

  // "Some User token"
  if (ctx.from._is_in_admin_list) {
    bot.telegram.sendMessage(ctx.chat.id, text.welcome, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Proceed",
              callback_data: "plus",
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

bot.action("plus", function (ctx) {
  if (ctx.from._is_in_admin_list) {
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, text.setting, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Add Token",
              callback_data: "add",
            },
          ],
          [{ text: "Token Setting", callback_data: "setting" }],
        ],
      },
    });
  } else {
    return;
  }
});

bot.action("add", function (ctx) {
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
              { text: "BSC", callback_data: "bsc" },
            ],
          ],
        },
      }
    );
  } else {
    return ctx.reply("Denied");
  }
});

bot.action("eth", function (ctx) {
  if (ctx.from._is_in_admin_list) {
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, text.token, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Uniswap",
              callback_data: "eUniswap",
            },
            {
              text: "Pancakeswap",
              callback_data: "ePancakeswap",
            },
          ],
          [
            {
              text: "Uniswap v3",
              callback_data: "eUniswapV3",
            },
            {
              text: "biswap",
              callback_data: "eBiswap",
            },
          ],
          [
            {
              text: "Sushiswap",
              callback_data: "eSushiswap",
            },
            {
              text: "pyeswap",
              callback_data: "ePyeswap",
            },
          ],
          [
            {
              text: "shibaswap",
              callback_data: "eShibaswap",
            },
            {
              text: "busta",
              callback_data: "eBusta",
            },
          ],
          [
            {
              text: ">>cancel",
              callback_data: "cancel",
            },
            {
              text: ">>cancel",
              callback_data: "cancel",
            },
          ],
        ],
      },
    });
  } else {
    return;
  }
});

bot.action("bsc", function (ctx) {
  if (ctx.from._is_in_admin_list) {
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, text.token, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Uniswap",
              callback_data: "bUniswap",
            },
            {
              text: "Pancakeswap",
              callback_data: "bPancakeswap",
            },
          ],
          [
            {
              text: "Uniswap v3",
              callback_data: "bUniswapV3",
            },
            {
              text: "biswap",
              callback_data: "bBiswap",
            },
          ],
          [
            {
              text: "Sushiswap",
              callback_data: "bSushiswap",
            },
            {
              text: "pyeswap",
              callback_data: "bPyeswap",
            },
          ],
          [
            {
              text: "shibaswap",
              callback_data: "bShibaswap",
            },
            {
              text: "busta",
              callback_data: "bBusta",
            },
          ],
          [
            {
              text: ">>cancel",
              callback_data: "cancel",
            },
            {
              text: ">>cancel",
              callback_data: "cancel",
            },
          ],
        ],
      },
    });
  } else {
    return;
  }
});
let ethList = [
  "eUniswap",
  "ePancakeswap",
  "eUniswapV3",
  "eBiswap",
  "eSushiswap",
  "eBusta",
];
let bscList = [
  "bUniswap",
  "bPancakeswap",
  "bUniswapV3",
  "bBiswap",
  "bSushiswap",
  "bBusta",
];

bot.action(ethList, function (ctx, next) {
  if (ctx.from._is_in_admin_list) {
    bot.telegram.sendMessage(
      ctx.chat.id,
      text.selection + " " + `${action.ethList}` + text.selectionContd,
      ctx.inlineQuery
    );
  }
  console.log(ctx.inlineQuery);
});

const init = async () => {
  mongoose
    .connect("mongodb://localhost:27017/telegram")
    .then((data) => {
      console.log(`Mongodb connected with serve: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
  bot.launch();
};

init();
