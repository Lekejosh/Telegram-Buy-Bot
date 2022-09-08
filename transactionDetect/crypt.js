"use strict";

const axios = require("axios");
const services = require("./balance");

class transaction {
  constructor() {
    this.transaction = {};
    this.transaction.unit = "";
  }
  async getTransaction(callback) {
    const res = await axios.get(services.balance);
    const con = await axios.get(services.contractN);
    const val = await axios.get(services.value);
    const coun = await axios.get(services.count);
    axios.all([res, con, val, coun]).then(
      axios.spread((...responses) => {
        const { timeStamp, hash } = responses[0].data.result[0];
        const { ContractName } = responses[1].data.result[0];

        const { type, description } = responses[2].data.transactions[0];
        const { total_transaction_count } = responses[3].data;

        let recieved = description.split(" ");

        console.log(timeStamp);
        // let main = res.data;
        this.transaction.lastValue = timeStamp;
        if (type == "receive") {
          if (this.transaction.unit == timeStamp) {
            return;
          }
          callback(
            `<b>${ContractName} Buy</b>\n<b>Spent</b>: N\A \n<b>Got</b>: ${recieved[1]} ${recieved[2]}\n<b>Buyer Position</b>: N\A \n<b>Buyer ETH Value</b>: N\A \n<b>Buy # </b>:${total_transaction_count}\n<a href="https://etherscan.io/tx/${hash}"><b>TX</b></a> |  <a href="https://dextools.io/"><b>Chart</b></a> |  <a href="https://t.me/buildgr33nerc"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
          );
        } else {
        }

        this.transaction.unit = timeStamp;
      })
    );
  }
}

module.exports = transaction;
