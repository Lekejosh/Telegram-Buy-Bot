const services = {
  balance: `https://api.etherscan.io/api?module=account&address=0xC08512927D12348F6620a698105e1BAac6EcD911&sort=desc&apikey=112R9MIZ97GI3M7UBVNAR34HYIGEW4RK8W&action=txlist`,
  bSmart: `https://api.bscscan.com/api?module=account&action=txlist&address=0xd4c73fd18f732bc6ee9fb193d109b2eed815df80&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=1FDN92AQHNQ7FMUWJ6SGJJYYF1UW3TBMNH`,
};

module.exports = services;
