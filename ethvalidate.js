// Apii to Validate Token Appress

const axios = require("axios");
module.exports = {
  validateToken: (tokenAddress) =>
    axios({
      method: "GET",
      url: `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${tokenAddress}&apikey=112R9MIZ97GI3M7UBVNAR34HYIGEW4RK8W`,
    }),
};
