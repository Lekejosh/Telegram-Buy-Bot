// Apii to Validate Token Appress
const axios = require("axios");
module.exports = {
  validateToken: (tokenAddress) =>
    axios({
      method: "GET",
      url: `https://api.dexscreener.com/latest/dex/search?q=${tokenAddress}`,
    }),
};
