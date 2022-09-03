// const axios = require("axios");

// const BASE_URL = "https://love-calculator.p.rapidapi.com";

// module.exports = {
//   getPercentage: (yourName, partnerName) =>
//     axios({
//       method: "GET",
//       url: `${BASE_URL}/getPercentage`,
//       headers: {
//         "content-type": "application/octet-stream",
//         "x-rapidapi-host": "love-calculator.p.rapidapi.com",
//         "x-rapidapi-key": "24736236demshefa578f021de88ep126b89jsn2e4a4fb05a68",
//       },
//       params: {
//         fname: yourName,
//         sname: partnerName,
//       },
//     }),
// };

const axios = require("axios");

// module.exports = {
//   validateToken: (tokenAddress) =>
//     axios({
//       method: "GET",
//       url: `https://crypto-wallet-address-validator.p.rapidapi.com/validate/${tokenAddress}`,
//       headers: {
//         "content-type": "application/octet-stream",
//         "X-RapidAPI-Key": "24736236demshefa578f021de88ep126b89jsn2e4a4fb05a68",
//         "X-RapidAPI-Host": "crypto-wallet-address-validator.p.rapidapi.com",
//       },
//       params: { currency: "eth", network: "both" },
//     }),
// };

module.exports = {
  validateToken: (tokenAddress) =>
    axios({
      method: "GET",
      url: `https://api.etherscan.com/api?module=contract&action=getsourcecode&address=${tokenAddress}&tag=latest&apikey=1FDN92AQHNQ7FMUWJ6SGJJYYF1UW3TBMNH`,
      // headers: {
      //   "content-type": "application/octet-stream",
      //   "X-RapidAPI-Key": "24736236demshefa578f021de88ep126b89jsn2e4a4fb05a68",
      //   "X-RapidAPI-Host": "crypto-wallet-address-validator.p.rapidapi.com",
      // },
      // params: { currency: "bsc", network: "both" },
    }),
};
