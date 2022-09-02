const Telegraf = require("telegraf");
// const Markup = require("telegraf/markup");
const Stage = require("telegraf/stage");
const session = require("telegraf/session");

const WizardScene = require("telegraf/scenes/wizard");

const verifyToken = require("./lovecalculator");

const bot = new Telegraf("5561811963:AAFV83oL535KmiZOHwkSIybgiwmoCAxUCxQ");

bot.start((ctx) => {
  ctx.reply(
    `Hello ${ctx.from.first_name}, would you like to know the love compatibility?`,
    inline_keyboard([callback_data("TOken Input", "TOKEN")]).extra()
  );
});

const tokenVerify = new WizardScene(
  "token",
  (ctx) => {
    ctx.reply("Enter Your Token Address");
    return ctx.wizard.next();
  },
  (ctx) => {
    ctx.wizard.state.yourName = ctx.message.text;
    ctx.reply("Enter the name of currency");
    return ctx.wizard.next();
  },
  (ctx) => {
    const currencyType = ctx.message.text;
    const tokenAddress = ctx.wizard.state.yourName;
    verifyToken
      .validateToken(tokenAddress, currencyType)
      .then((res) => {
        const { address, currency, network, isValid } = res.data;
        ctx.reply(
          `${address}+${currency}+${network}+${isValid}`,
          inline_keyboard([callback_data("next", "TOKEN")]).extra()
        );
      })
      .catch((err) =>
        ctx.reply(
          err.message,
          inline_keyboard([callback_data("calculate again", "TOKEN")]).extra()
        )
      );
    return ctx.scene.leave();
  }
);

const stage = new Stage([tokenVerify], { default: "token" });
bot.use(session());
bot.use(stage.middleware());
bot.launch();
