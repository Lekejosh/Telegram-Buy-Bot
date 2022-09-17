const axios = require("axios");

const res = axios.get(
  `https://api.unmarshal.com/v2/ethereum/address/0x0aebd4ea87c2b7059429716c49a2c1b25183c3b8/transactions?page=1&pageSize=10&contract=string&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
);
const vue = axios.get(
  `https://api.unmarshal.com/v1/ethereum/address/0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF/transactions/count?auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
);

axios.all([res, vue]).then(
  axios.spread((...responses) => {
    const { sent } = responses[0].data.transactions[0];
    let value1 = Number(sent[0].value);
    let value2 = Number(sent[1].value);
    sum = value1 + value2;

    if (sent.length === 2) {
      console.log("positive");
      console.log(sent);
      console.log(sum.toLocaleString("fullwide", { useGrouping: false }));
    } else {
      console.log("Fuck Off");
      console.log(sent);
    }
  })
);
