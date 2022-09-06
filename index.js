const Telegraf = require("telegraf");
const mongoose = require("mongoose");
const { session } = require("telegraf-session-mongoose");
const text = require("./text.json");
const verifyToken = require("./ethvalidate");
const bverifyToken = require("./bscvalidate");
const User = require("./userModel");
const Stage = require("telegraf/stage");
const Robot = require("./bot");
const WizardScene = require("telegraf/scenes/wizard");
const bot = new Telegraf("5561811963:AAFV83oL535KmiZOHwkSIybgiwmoCAxUCxQ");
const instance = new Robot(bot);

// Bot alert interval
setInterval(async () => {
  try {
    instance.watchChanges();
  } catch (error) {
    console.error(error);
    return;
  }
}, 8000);

// Session start

bot.use(function (ctx, next) {
  if (ctx.chat.id > 0) return next();
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

//Token add and Database Save

bot.command("addtoken", (ctx, next) => {
  if (ctx.from._is_in_admin_list) {
    User.findOne({ chatId: ctx.chat.id }).then((user) => {
      if (user) {
        next();
      } else {
        const newUser = User.create({
          chatId: ctx.chat.id,
          telegram: "null",
          step: "$100",
          cSupply: "null",
          emoji: "null",
          mEnable: "null",
          mImage: "null",
        }).then((neww) => {
          console.log(neww);
        });
      }
    });
  } else {
    return next();
  }

  if (ctx.from._is_in_admin_list) {
    const test_welcome = {
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
      parse_mode: "HTML",
    };
    bot.telegram.sendMessage(ctx.chat.id, text.welcome, test_welcome);
  } else {
    return ctx.reply("Only Admin can access this", {
      reply_to_message_id: ctx.message.message_id,
    });
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

// Settings

bot.action("setting", function (ctx) {
  if (ctx.from._is_in_admin_list) {
    ctx.deleteMessage();
    const chatId = ctx.chat.id;
    User.find({ chatId }, (error, data) => {
      if (error) {
        console.log(err);
      } else {
        console.log(data[0].ethAddress);
        // const keyboard = [];
        // for (let i = 0; i < data[0].ethAddress.length; i++) {
        //   keyboard.push([
        //     {
        //       text: `${data[0].ethAddress[i].name}`,
        //       callback_data: "tsetting",
        //     },
        //   ]);
        // }
        if (data[0].ethAddress[0] == null) {
          ctx.reply("No token avaliable");
        } else {
          bot.telegram.sendMessage(ctx.chat.id, text.setting, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `${data[0].ethAddress[0].name}`,
                    callback_data: "tsetting",
                  },
                ],
                [
                  {
                    text: `>>cancel`,
                    callback_data: "cancel",
                  },
                ],
              ],
            },
          });
        }
      }
    });
  } else {
    return;
  }
});

bot.action("tsetting", function (ctx) {
  let chatId = ctx.chat.id;
  User.find({ chatId }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data[0].chatId);
      if (ctx.from._is_in_admin_list) {
        ctx.deleteMessage();
        const set = {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Telegram Group Link",
                  callback_data: "tele",
                },
              ],
              [
                {
                  text: `step: ${data[0].step}`,
                  callback_data: "step",
                },
              ],
              [
                {
                  text: `Circulating Supply: ${data[0].cSupply}`,
                  callback_data: "cSupply",
                },
              ],
              [
                {
                  text: `Emoji: ${data[0].emoji}`,
                  callback_data: "emoji",
                },
              ],
              [
                {
                  text: `Media Enabled: ${data[0].mEnable}`,
                  callback_data: "menable",
                },
              ],
              [
                {
                  text: `Media Image (click to view/change)`,
                  callback_data: "mImage",
                },
              ],
              [
                {
                  text: "Delete This Token",
                  callback_data: "tokenDelete",
                },
              ],
              [
                {
                  text: ">>Cancel",
                  callback_data: "cancel",
                },
              ],
            ],
          },
          parse_mode: "HTML",
        };
        bot.telegram.sendMessage(
          ctx.chat.id,
          `Successfully added Token Name: ${data[0].ethAddress[0].name}  to ${ctx.chat.title}.\nPlease update each of the settings below to suit your needs. If you want to change any, simply\nclick on the applicable button.\nToken Name: ${data[0].ethAddress[0].name} \nToken Address:${data[0].ethAddress[0].token_Address} \nPair Address:`,
          set
        );
      } else {
        return;
      }
    }
  });
});

//Token Add function

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
            ],
          ],
        },
      }
    );
  } else {
    return ctx.reply("Denied");
  }
});

//ETH action

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
let ethList = [
  "e-Uniswap",
  "e-Pancakeswap",
  "e-UniswapV3",
  "e-Biswap",
  "e-Sushiswap",
  "e-Busta",
];

// Token Stage
const tokenVerify = new WizardScene(
  "token",
  (ctx, next) => {
    ctx.reply(
      `Please paste the TOKEN address of the token you would like BuildGr33n Buy Bot to track.`
    );
    ctx.wizard.state.data = {};
    return ctx.wizard.next();
  },
  (ctx, next) => {
    ctx.wizard.state.data.address = ctx.message.text;
    const tokenAddress = ctx.wizard.state.data.address;
    verifyToken
      .validateToken(tokenAddress)
      .then((res) => {
        const { status, result } = res.data;

        if (result[0].ContractName == "" || status == 0) {
          ctx.reply("Address is not valid");
        } else {
          var chatId = ctx.chat.id;
          User.findOne({
            "ethAddress.name": result[0].ContractName,
          }).then((user) => {
            if (user) {
              ctx.reply("Address already exists");
              next();
            } else {
              var chatId = ctx.chat.id;
              User.findOneAndUpdate(
                { chatId },
                {
                  $push: {
                    ethAddress: {
                      name: result[0].ContractName,
                      token_Address: tokenAddress,
                    },
                  },
                }
              ).then((neww) => {
                console.log(neww);
              });
              bot.telegram.sendMessage(
                ctx.chat.id,
                `Token Namr found\n Tap to save}`,
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
const stage = new Stage([tokenVerify]);
bot.use(session());
bot.use(stage.middleware());

//ETHList action
bot.action(ethList, Stage.enter("token"));

// Cancel Action
bot.action("cancel", (ctx) => {
  ctx.deleteMessage();
  ctx.reply("bye");
});

//Save Token

bot.action("save", (ctx) => {
  ctx.reply("Token Added to Buildgr33bot");
});

//DB connect and Bot launch

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
