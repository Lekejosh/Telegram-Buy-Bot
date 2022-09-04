const Telegraf = require("telegraf");
const mongoose = require("mongoose");
const { session } = require("telegraf-session-mongoose");
const text = require("./text.json");
const verifyToken = require("./ethvalidate");
const bverifyToken = require("./bscvalidate");
const User = require("./userModel");
const Stage = require("telegraf/stage");

const WizardScene = require("telegraf/scenes/wizard");

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
  if (ctx.from._is_in_admin_list) {
    User.findOne({ chatId: ctx.chat.id }).then((user) => {
      if (user) {
        next();
      } else {
        const newUser = User.create({
          // firstName: ctx.from.first_name,
          // userId: ctx.from.id,
          chatId: ctx.chat.id,
        }).then((neww) => {
          console.log(neww);
        });
      }
    });
  } else {
    return next();
  }

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
              text: "Token Setting",
              url: "Tsetting",
            },
          ],
          [{ text: ">>Cancel", callback_data: "cancel" }],
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
          [{ text: "Token Setting", callback_data: "Tsetting" }],
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
              callback_data: "e-Uniswap",
            },
            {
              text: "Pancakeswap",
              callback_data: "e-Pancakeswap",
            },
          ],
          [
            {
              text: "Uniswap v3",
              callback_data: "e-UniswapV3",
            },
            {
              text: "biswap",
              callback_data: "e-Biswap",
            },
          ],
          [
            {
              text: "Sushiswap",
              callback_data: "e-Sushiswap",
            },
            {
              text: "pyeswap",
              callback_data: "e-Pyeswap",
            },
          ],
          [
            {
              text: "shibaswap",
              callback_data: "e-Shibaswap",
            },
            {
              text: "busta",
              callback_data: "e-Busta",
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
  "e-Uniswap",
  "e-Pancakeswap",
  "e-UniswapV3",
  "e-Biswap",
  "e-Sushiswap",
  "e-Busta",
];
let bscList = [
  "bUniswap",
  "bPancakeswap",
  "bUniswapV3",
  "bBiswap",
  "bSushiswap",
  "bBusta",
];

const tokenVerify = new WizardScene(
  "token",
  (ctx, next) => {
    ctx.reply("Enter Your Token Address");
    ctx.wizard.state.data = {};
    return ctx.wizard.next();
  },
  (ctx, next) => {
    ctx.wizard.state.data.address = ctx.message.text;
    const tokenAddress = ctx.wizard.state.data.address;
    verifyToken
      .validateToken(tokenAddress)
      .then((res) => {
        console.log(res.data);
        const { status, result } = res.data;

        if (result[0].ContractName == "" || status == 0) {
          ctx.reply("Address is not valid");
        } else {
          var chatId = ctx.chat.id;
          User.findOne({
            ethAddress: {
              name: result[0].ContractName,
              token_Address: tokenAddress,
            },
          }).then((user) => {
            if (user) {
              ctx.reply("Address already exists");
              next();
            } else {
              var chatId = ctx.chat.id;
              const newUser = User.findOneAndUpdate(chatId, {
                $push: {
                  ethAddress: {
                    name: result[0].ContractName,
                    token_Address: tokenAddress,
                  },
                },
              }).then((neww) => {
                console.log(neww);
              });
              bot.telegram.sendMessage(
                ctx.chat.id,
                `Contract Name found ${ctx.chat.title}`,
                {
                  reply_markup: {
                    inline_keyboard: [
                      [
                        {
                          text: `${result[0].ContractName}`,
                          callback_data: "save",
                        },
                      ],
                    ],
                  },
                }
              );
            }
          });
        }
      })
      .catch((err) => ctx.reply(err.message));
    return ctx.scene.leave();
  }
);
const btokenVerify = new WizardScene(
  "btoken",
  (ctx) => {
    ctx.reply("Enter Your Token Address");
    ctx.wizard.state.data = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.data.address = ctx.message.text;
    const tokenAddress = ctx.wizard.state.data.address;
    bverifyToken
      .bvalidation(tokenAddress)
      .then((res) => {
        const { status, result } = res.data;

        if (result[0].ContractName == "" || status == 0) {
          ctx.reply("Address is not valid");
        } else {
          var chatId = ctx.chat.id;
          User.findOne({
            bscAddress: {
              name: result[0].ContractName,
              token_Address: tokenAddress,
            },
          }).then((user) => {
            if (user) {
              ctx.reply("Address already exists");
            } else {
              var chatId = ctx.chat.id;
              const newUser = User.findOneAndUpdate(chatId, {
                $push: {
                  bscAddress: {
                    name: result[0].ContractName,
                    token_Address: tokenAddress,
                  },
                },
              }).then((neww) => {
                console.log(neww);
              });
              // ctx.reply(`${result[0].ContractName}....`);
              bot.telegram.sendMessage(
                ctx.chat.id,
                `Contract Name found ${ctx.chat.title}`,
                {
                  reply_markup: {
                    inline_keyboard: [
                      [
                        {
                          text: `${result[0].ContractName}`,
                          callback_data: "save",
                        },
                      ],
                    ],
                  },
                }
              );
            }
          });
        }
      })
      .catch((err) => ctx.reply(err.message));
    return ctx.scene.leave();
  }
);
const stage = new Stage([tokenVerify, btokenVerify]);
bot.use(session());
bot.use(stage.middleware());

bot.action(ethList, Stage.enter("token"));

bot.action(bscList, (ctx) => {
  Stage.enter("btoken")(ctx);
});

bot.action("cancel", (ctx) => {
  ctx.deleteMessage();
  ctx.reply("bye");
});

bot.action("save", (ctx) => {
  ctx.reply("Token Added to Buildgr33bot");
});

const init = async () => {
  mongoose
    .connect("mongodb://localhost:27017/buybot")
    .then((data) => {
      console.log(`Mongodb connected with serve: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
  bot.launch();
};

init();
