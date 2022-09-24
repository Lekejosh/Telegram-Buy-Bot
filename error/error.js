// const ErrorHandler = require("./errorHandler");

// module.exports = function (err, ctx)  {
//   err.statusCode = err.statusCode || 500;
//   err.message = err.message || "Internal Server Error";

//   //Wrong Mongodb Id error
//   if (err.name === "CastError") {
//     const message = `Resource not found. invalid : ${err.path}`;
//     err = new ErrorHandler(message, 400);
//   }

//   //Momgoose duplicate Key error
//   if (err.code === 11000) {
//     const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
//     err = new ErrorHandler(message, 400);
//   }

//     if (err.code === 429) {
//       const message = `Too Many resquests...`;
//       err = new ErrorHandler(message, 429);
//     }
//   //JWT Expire error
//   if (err.name === "TokenExpiredError") {
//     const message = `Json Web Token is Expired, Try again`;
//     err = new ErrorHandler(message, 400);
//   }
//   console.log(err.message)

// };

const { Telegraf } = require("telegraf");

const bot = new Telegraf("5561811963:AAFV83oL535KmiZOHwkSIybgiwmoCAxUCxQ");

module.exports = function ({ err, name, ctx }) {
  const headers = JSON.stringify(err?.response?.headers, null, "-  ") || null;
  const request = JSON.stringify(err?.request, null, "-  ") || null;
  const config = JSON.stringify(err?.config, null, "-  ") || null;
  const message = err?.message || null;
  const status = err?.status || null;
  const data = err?.data || null;

  let stringMessage;

  if (err.response) {
    stringMessage = `Data: ${data}\n\nStatus: ${status}\n\nHeaders: ${headers}\n\nConfig: ${config}`;
  } else if (err.request) {
    stringMessage = `Request: ${request}\n\nConfig: ${config}`;
  } else {
    stringMessage = `Message: ${message}\n\nConfig: ${config}`;
  }
  if (err.name === "TypeError") {
    ctx.reply("can't read test");
  }

  // notify user
  ctx.reply(`Error ${message}...Start again`);
};
