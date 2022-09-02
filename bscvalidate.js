const axios = require("axios");

module.exports = {
  bvalidation: (tokenAddress) =>
    axios({
      method: "GET",
      url: `https://crypto-wallet-address-validator.p.rapidapi.com/validate/${tokenAddress}`,
      headers: {
        "content-type": "application/octet-stream",
        "X-RapidAPI-Key": "24736236demshefa578f021de88ep126b89jsn2e4a4fb05a68",
        "X-RapidAPI-Host": "crypto-wallet-address-validator.p.rapidapi.com",
      },
      params: { currency: "bsc", network: "both" },
    }),
};
