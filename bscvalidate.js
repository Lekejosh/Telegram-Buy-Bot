const axios = require("axios");

module.exports = {
  bvalidation: (tokenAddress) =>
    axios({
      method: "GET",
      url: `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${tokenAddress}&tag=latest&apikey=1FDN92AQHNQ7FMUWJ6SGJJYYF1UW3TBMNH`,
    }),
};
