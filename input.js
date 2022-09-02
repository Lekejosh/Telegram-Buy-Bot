const { Telegraf } = require("telegraf");
const mongoose = require("mongoose");
const { session } = require("telegraf-session-mongoose");
const text = require("./text.json");
const User = require("./userModel");
const Stage = require("telegraf/stage");
const session = require("telegraf/session");
const loveCalculator = require("./lovecalculator");

const Token = new WizardScene(
  "Token",
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
    Token.getPercentage(tokenAddress, currencyType)
      .then((res) => {
        const { isValid } = res.data;
        ctx.reply(
          `${isValid}`,
          Markup.inlineKeyboard([
            Markup.callbackButton("next", "LOVE_CALCULATE"),
          ]).extra()
        );
      })
      .catch((err) =>
        ctx.reply(
          err.message,
          Markup.inlineKeyboard([
            Markup.callbackButton("calculate again", "LOVE_CALCULATE"),
          ]).extra()
        )
      );
    return ctx.scene.leave();
  }
);
