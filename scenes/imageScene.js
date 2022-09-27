const { Composer } = require("telegraf");
const Telegraf = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const bot = new Telegraf("5561811963:AAFV83oL535KmiZOHwkSIybgiwmoCAxUCxQ");
const User = require("../userModel");

const step1 = (ctx) => {
  ctx.reply("Send me the image");
  return ctx.wizard.next();
};

const step2 = new Composer();

step2.on("photo", (ctx) => {
   if(ctx?.message?.photo == undefined){
    ctx.reply("Please send a photo... Note you can't send a or Document or a Document as a photo")
      ctx.scene.leave();
    }else{
  let photos = ctx.message.photo;
  const { file_id: fileId } = photos[0];
  console.log(fileId);
  const chatId = ctx.chat.id;
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
