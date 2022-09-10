const services = {
  balance: `https://api.etherscan.io/api?module=account&sort=desc&apikey=112R9MIZ97GI3M7UBVNAR34HYIGEW4RK8W&action=txlist&address=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF`,
  contractN: `https://api.etherscan.io/api?module=contract&action=getsourcecode&apikey=112R9MIZ97GI3M7UBVNAR34HYIGEW4RK8W&address=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF`,
  value: `https://api.unmarshal.com/v1/ethereum/address/0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF/transactions?page=1&chainId=false&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`,
  count: `https://api.unmarshal.com/v1/ethereum/address/0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF/transactions/count?auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`,
  bSmart: `https://api.bscscan.com/api?module=account&action=txlist&address=0xd4c73fd18f732bc6ee9fb193d109b2eed815df80&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=1FDN92AQHNQ7FMUWJ6SGJJYYF1UW3TBMNH`,
};

module.exports = services;
