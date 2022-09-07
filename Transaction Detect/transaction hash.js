module.exports = {
  validateToken: (tokenAddress) =>
    axios({
      method: "GET",
      url: `https://api.etherscan.io/api?module=account&action=txlist&address=${tokenAddress}&apikey=112R9MIZ97GI3M7UBVNAR34HYIGEW4RK8W`,
    }),
};
