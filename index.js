const Telegraf = require("telegraf");

const mongoose = require("mongoose");
const { session } = require("telegraf-session-mongoose");
const text = require("./text.json");
const verifyToken = require("./ethvalidate");
const User = require("./userModel");
const Group = require("./groupModel");
const Stage = require("telegraf/stage");
// Transaction Robot
const Robot = require("./transactionDetect/bot");
const upload = require("./upload");
const { Scenes, Composer } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const bot = new Telegraf("5561811963:AAFV83oL535KmiZOHwkSIybgiwmoCAxUCxQ");
const imageScene = require("./scenes/imageScene.js").imageScene;
// //Transaction RObot Instance
const instance = new Robot(bot);
const errorMiddleware = require("./error/error");
const ErrorMiddleware = require("./error/errorHandler");
const catchAsyncErrors = require("./error/catchAsyncErrors");
const mainId = [];
// Bot alert interval
setInterval(async () => {
  try {
    instance.watchChanges();
  } catch (error) {
    console.error(error);
    return;
  }
}, 25000);

// Session start

bot.use(function (ctx, next) {
  if (ctx.chat.id > 0) {
    // bot.telegram.sendMessage(ctx.chat.id, text.chatStart, {
    //   parse_mode: "HTML",
    //   disable_web_page_preview: true,
    // });
    next();
  } else {
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
  }
});

bot.catch((err, ctx) => {
  return errorMiddleware({ err, ctx, name: "index.js/bot.catch()" });
});

//Token add and Database Save

bot.command("addtoken", async (ctx, next) => {
  if (ctx.from._is_in_admin_list) {
    await User.findOne({ chatId: ctx.chat.id }).then((user) => {
      if (user) {
        console.log(ctx);
        console.log(ctx.chat.type);
        console.log(ctx.update);
        console.log("chat=>", ctx.update.message.chat._admins);
        console.log("from=>", ctx.update.message.from);
        next();
      } else {
        User.create({
          chatId: ctx.chat.id,
          step: "100",
          cSupply: "100000000000000000",
          emoji: "Not Set",
          mEnable: false,

          mImage: "Not Set",
          timeStamp: "0000000",
        }).then((neww) => {
          console.log(neww);
          let admi = ctx.update.message.chat._admins;

          Group.create({
            chatId: ctx.chat.id,
            groupName: ctx.chat.title,
            adminList: admi,
          }).then((upda) => {
            console.log(upda);
          });
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
              text: "Click Me",
              url: `https://t.me/BuildGr33nBuyBot?start=${ctx.chat.id}`,
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

bot.hears(/\/start(.*)/, (msg, match, ctx) => {
  let upd = msg.match.input.split(" ");
  mainId.push(upd[1]);
  Group.findOne(
    { chatId: upd[1] },
    { adminList: { $elemMatch: { "user.id": msg.update.message.from.id } } },
    (error, data) => {
      if (error) {
        console.log(error);
      } else {
        Group.findOne({ chatId: upd[1] }, (error, result) => {
          if (error) {
            console.log(error);
          } else {
            let adminId = data?.adminList[0]?.user.id;
            if (adminId == undefined || adminId == null) {
              bot.telegram.sendMessage(
                msg.update.message.from.id,
                text.chatStart,
                {
                  parse_mode: "HTML",
                  disable_web_page_preview: true,
                }
              );
            } else {
              bot.telegram.sendMessage(
                msg.update.message.from.id,
                text.setting,
                {
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
                }
              );
            }
          }
        });
      }
    }
  );

  console.log(msg);
  console.log(match);

  console.log(upd[1]);
  console.log(msg.update);
  console.log("chat", msg.update.message.chat);
  console.log("from", msg.update.message.from);
});

// bot.action("plus", function (ctx) {
//   if (ctx.from._is_in_admin_list) {
//     bot.telegram.sendMessage(ctx.chat.id, text.setting, {
//       reply_markup: {
//         inline_keyboard: [
//           [
//             {
//               text: "Add Token",
//               callback_data: "add",
//             },
//           ],
//           [{ text: "Token Setting", callback_data: "setting" }],
//         ],
//       },
//     });
//   } else {
//     return;
//   }
// });

//Token Add function

bot.action("add", function (ctx) {
  User.find({ chatId: mainId[0] }, (error, data) => {
    if (error) {
      console.log(err);
    } else {
      if (
        data[0].ethAddress.name == null ||
        data[0].ethAddress.name == undefined
      ) {
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
        bot.telegram.sendMessage(
          ctx.chat.id,
          "Are you sure you want to change already Reqisterd Token?",
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Yes",
                    callback_data: "eth",
                  },
                  {
                    text: "No",
                    callback_data: "cancel",
                  },
                ],
                [
                  {
                    text: "View Settings of Already Added Token",
                    callback_data: "tsetting",
                  },
                ],
              ],
            },
          }
        );
      }
    }
  });
});

// Settings

bot.command("settings", function (ctx) {
  const chatId = ctx.chat.id;
  if (ctx.from._is_in_admin_list) {
    User.find({ chatId }, (error, data) => {
      if (error) {
        console.log(err);
      } else {
        if (!data[0]?.chatId) {
          ctx.reply(
            "User not found... Please Register this group Using /addtoken "
          );
        } else {
          console.log(data[0].ethAddress);
          if (data[0].ethAddress == null) {
            ctx.reply("No token avaliable");
          } else {
            bot.telegram.sendMessage(ctx.chat.id, text.setting, {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: `${data[0].ethAddress.name}`,
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
      }
    });
  } else {
    return;
  }
});

bot.action("setting", function (ctx) {
  if (ctx.from._is_in_admin_list) {
    const chatId = ctx.chat.id;
    User.find({ chatId }, (error, data) => {
      if (error) {
        console.log(err);
      } else {
        console.log(data[0].ethAddress);
        // }
        if (data[0].ethAddress == null) {
          ctx.reply(
            "No token Registered To this group... Trying adding a New token"
          );
        } else {
          bot.telegram.sendMessage(ctx.chat.id, text.setting, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `${data[0].ethAddress.name}`,
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
        const set = {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `Telegram Group Link: ${data[0].telegram}`,
                  callback_data: "tele",
                },
              ],
              [
                {
                  text: `step: $ ${data[0].step}`,
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
                  callback_data: "mImages",
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
                  text: "Save Token settings",
                  callback_data: "save",
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
          `Successfully added Token Name: ${data[0].ethAddress.name}  to ${ctx.chat.title}.\nPlease update each of the settings below to suit your needs. If you want to change any, simply\nclick on the applicable button.\nToken Name: ${data[0].ethAddress.name} \nToken Address:${data[0].ethAddress.token_Address} \nPair Address:${data[0].ethAddress.pair_Address}`,
          set
        );
      } else {
        return;
      }
    }
  });
});

bot.action("mImages", (ctx) => {
  chatId = ctx.chat.id;
  User.find({ chatId }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data[0].mEnable);
      if (data[0].mEnable == false) {
        ctx.reply("Media is not enabled... Enable in settings");
      } else {
        bot.telegram.sendMessage(ctx.chat.id, "What do you want to do", {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "View Already Saved Image",
                  callback_data: `viewImage`,
                },
              ],
              [
                {
                  text: "Change Image",
                  callback_data: `mImageChange`,
                },
              ],
            ],
          },
        });
      }
    }
  });
});

bot.action("viewImage", (ctx) => {
  chatId = ctx.chat.id;
  User.find({ chatId }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      if (data[0].mImage == "Not Set") {
        bot.telegram.sendMessage(ctx.chat.id, `No Image Saved`, {
          reply_markup: {
            inline_keyboard: [[{ text: ">>back", callback_data: "tsetting" }]],
          },
        });
      } else {
        bot.telegram.sendPhoto(ctx.chat.id, `${data[0].mImage}`, {
          reply_markup: {
            inline_keyboard: [[{ text: ">>back", callback_data: "tsetting" }]],
          },
        });
      }
    }
  });
});

// Telegram Link Update and Edit

bot.action("tele", function (ctx) {
  if (ctx.from._is_in_admin_list) {
    const chatId = ctx.chat.id;
    User.find({ chatId }, (error, data) => {
      if (error) {
        console.log(error);
      } else {
        bot.telegram.sendMessage(ctx.chat.id, "What do you want to do", {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Current Link",
                  callback_data: `currentLink`,
                },
              ],
              [
                {
                  text: "Update Link",
                  callback_data: `updateTele`,
                },
              ],
            ],
          },
        });
      }
    });
  } else {
    return ctx.reply("Denied");
  }
});

bot.action("currentLink", (ctx) => {
  chatId = ctx.chat.id;
  User.find({ chatId }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      if (data[0].telegram == "Not Set") {
        ctx.reply("No Link saved yet");
      } else {
        ctx.reply(`Your link is: ${data[0].telegram}`);
      }
    }
  });
});

//Token Delete
bot.action("tokenDelete", function (ctx) {
  const chatId = ctx.chat.id;
  User.find({ chatId }, (error, data) => {
    if (error) {
      ctx.reply("Error getting user");
    } else {
      console.log(data[0].ethAddress);
      let toks = data[0].ethAddress;
      User.findOneAndDelete(
        { chatId },

        { toks },

        (error, data) => {
          if (error) {
            ctx.reply("error");
          } else {
            ctx.reply("Deleted Successfully");
          }
        }
      );
    }
  });
});

//ETH  Scene

bot.action("eth", function (ctx) {
  if (ctx.from._is_in_admin_list) {
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
        console.log(res.data);
        const { pairs } = res.data;

        if (pairs.length === 0 || pairs[0].chainId !== "ethereum") {
          ctx.reply("Address is not valid");
        } else {
          var chatId = ctx.chat.id;
          User.findOneAndUpdate(
            { chatId },
            {
              ethAddress: {
                name: pairs[0].baseToken.name,
                token_Address: pairs[0].baseToken.address,
                pair_Address: pairs[0].pairAddress,
              },
            }
          ).then((neww) => {
            console.log(neww);
          });
          bot.telegram.sendMessage(
            ctx.chat.id,
            `Token found\n Tap to set alert info`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: `${pairs[0].baseToken.symbol}/${pairs[0].quoteToken.symbol} \n\n ${pairs[0].baseToken.address}`,
                      callback_data: "tsetting",
                    },
                  ],
                ],
              },
            }
          );
        }
      })
      .catch((err) => ctx.reply(err.message));
    return ctx.scene.leave();
  }
);

// Setting Scences

const telegramLink = new WizardScene(
  "updateTele",
  (ctx) => {
    ctx.reply(`Please paste your Telegram Link`);
    ctx.wizard.state.data = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.data.address = ctx.message.text;
    const telegramLink = ctx.wizard.state.data.address;
    console.log(ctx.chat.id);
    const chatId = ctx.chat.id;
    const user = User.findOneAndUpdate(
      { chatId },
      { telegram: `${telegramLink}` },
      (error, data) => {
        if (error) {
          ctx.reply("Not valid");
        } else {
          bot.telegram.sendMessage(ctx.chat.id, `Saved Successfully`, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `>>Back`,
                    callback_data: "tsetting",
                  },
                ],
              ],
            },
          });
        }
      }
    );
    return ctx.scene.leave();
  }
);

// const mImages = new WizardScene(
//   "mediaImage",
//   (ctx) => {
//     ctx.reply(`Please send your transaction Image`);
//         ctx.wizard.state.data = {};

//     return ctx.wizard.next();
//   },
//   bot.on('photo',(ctx) => {
//     ctx.wizard.state.data.image = ctx.message.photo
//     let photos = ctx.wizard.state.data.image;
//     console.log(photos)
//     const chatId = ctx.chat.id;

//    const id = photos[0].file_id;
//    console.log(id)
//     User.findOneAndUpdate(
//       { chatId },
//       { mImage: `${id}`},
//       (error, data) => {
//         if (error) {
//           ctx.reply("Not valid");
//         } else {
//           bot.telegram.sendPhoto(
//             ctx.chat.id,
//             "AgACAgQAAxkBAAIYdmMsWuqTrlyhvcmVFkrNBRZ7t7z7AAJxvDEbC4RpUa-K5aPO5IJIAQADAgADcwADKQQ"
//           );
//         }
// })

//   return ctx.scene.leave();
//   })
// );

const Step = new WizardScene(
  "step",
  (ctx) => {
    ctx.reply(`Input Step Amount`);
    ctx.wizard.state.data = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.data.address = ctx.message.text;
    const step = ctx.wizard.state.data.address;
    console.log(ctx.chat.id);
    const chatId = ctx.chat.id;
    const user = User.findOneAndUpdate(
      { chatId },
      { step: `${step}` },
      (error, data) => {
        if (error) {
          ctx.reply("Not Valid... Numbers only");
        } else {
          bot.telegram.sendMessage(ctx.chat.id, `Saved Successfully`, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `>>Back`,
                    callback_data: "tsetting",
                  },
                ],
              ],
            },
          });
        }
      }
    );
    return ctx.scene.leave();
  }
);

const Csupply = new WizardScene(
  "cSupply",
  (ctx) => {
    ctx.reply(`Input Step Amount`);
    ctx.wizard.state.data = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.data.address = ctx.message.text;
    const supply = ctx.wizard.state.data.address;
    console.log(ctx.chat.id);
    const chatId = ctx.chat.id;
    const user = User.findOneAndUpdate(
      { chatId },
      { cSupply: `${supply}` },
      (error, data) => {
        if (error) {
          ctx.reply("Nummbers only");
        } else {
          bot.telegram.sendMessage(ctx.chat.id, `Saved Successfully`, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `>>Back`,
                    callback_data: "tsetting",
                  },
                ],
              ],
            },
          });
        }
      }
    );
    return ctx.scene.leave();
  }
);

const Emoji = new WizardScene(
  "emoji",
  (ctx) => {
    ctx.reply(`Input Emoji`);
    ctx.wizard.state.data = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.data.address = ctx.message.text;
    const emoji = ctx.wizard.state.data.address;
    console.log(ctx.chat.id);
    const chatId = ctx.chat.id;
    const user = User.findOneAndUpdate(
      { chatId },
      { emoji: `${emoji}` },
      (error, data) => {
        if (error) {
          ctx.reply(`Not accepted`);
        } else {
          bot.telegram.sendMessage(ctx.chat.id, `Saved Successfully`, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `>>Back`,
                    callback_data: "tsetting",
                  },
                ],
              ],
            },
          });
        }
      }
    );
    return ctx.scene.leave();
  }
);

const Media = new WizardScene(
  "menable",
  (ctx) => {
    ctx.reply(`Please type in 'true' for Yes and "false" for No`);
    ctx.wizard.state.data = {};
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.data.address = ctx.message.text;
    const menable = ctx.wizard.state.data.address;
    console.log(ctx.chat.id);
    const chatId = ctx.chat.id;
    const user = User.findOneAndUpdate(
      { chatId },
      { mEnable: `${menable}` },
      (error, data) => {
        if (error) {
          ctx.reply(
            `Not Accepted... Type either "true" or "false" in small letters`
          );
        } else {
          bot.telegram.sendMessage(ctx.chat.id, `Saved Successfully`, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: `>>Back`,
                    callback_data: "tsetting",
                  },
                ],
              ],
            },
          });
        }
      }
    );
    return ctx.scene.leave();
  }
);

const stage = new Stage([
  tokenVerify,
  telegramLink,
  Step,
  Csupply,
  Emoji,
  Media,
  imageScene,
  // mImages
]);

bot.use(session());
bot.use(stage.middleware());

//ETHList action

bot.action(ethList, Stage.enter("token"));
bot.action("updateTele", (ctx) => {
  Stage.enter("updateTele")(ctx);
});
bot.action("step", (ctx) => {
  Stage.enter("step")(ctx);
});
bot.action("cSupply", (ctx) => {
  Stage.enter("cSupply")(ctx);
});
bot.action("emoji", (ctx) => {
  Stage.enter("emoji")(ctx);
});
bot.action("mImageChange", Stage.enter("imageScene"));
bot.action("menable", (ctx) => {
  Stage.enter("menable")(ctx);
});

// Cancel Action
bot.action("cancel", (ctx) => {
  ctx.reply("bye");
});

//Save Token
bot.action("save", (ctx) => {
  ctx.reply("Saved");
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
  bot.launch("uncaughtException", (err) => {
    console.log(`Error: $err: ${err.message}`);
    console.log(`Shutting down the server due to uncaught Expectation`);
    bot.exit(1);
  });
};

init();
