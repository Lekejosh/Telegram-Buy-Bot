const { Composer } = require("telegraf");
const Telegraf = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const bot = new Telegraf("5561811963:AAFV83oL535KmiZOHwkSIybgiwmoCAxUCxQ");
const User = require("../userModel");
const { mainId } = require("../index");



const step1 = (ctx) => {
  ctx.reply(
    "Be sure when sending image, it is sent with compression(if you're using a PC)"
  );
  console.log("main Id", mainId);
  return ctx.wizard.next();
};

const step2 = new Composer();

step2.on(["photo", "document"], (ctx) => {
  if (ctx.update.message.document) {
    ctx.reply(
      "Image invalid! Please send image as 'Photo' and not a 'File'. Try again"
    );
  } else {
    let photos = ctx.message.photo;
    const { file_id: fileId } = photos[0];
    console.log(fileId);
    const chatId = mainId[0];
    User.findOneAndUpdate(
      { chatId },
      {
        mImage: `${fileId}`,
      },
      (error, data) => {
        if (error) {
          console.log(error);
        } else {
          bot.telegram.sendMessage(ctx.chat.id, "Done", {
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
});

const imageScene = new WizardScene("imageScene", (ctx) => step1(ctx), step2);

module.exports = { imageScene };
