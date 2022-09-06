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
    axios.all([res, con, val]).then(
      axios.spread((...responses) => {
        const { timeStamp, gasPrice, from } = responses[0].data.result[0];
        const { ContractName } = responses[1].data.result[0];

        const { type, description } = responses[2].data.transactions[0];
        let recieved = description.split(" ");

        console.log(timeStamp);
        // let main = res.data;
        this.transaction.lastValue = timeStamp;
        if (type == "receive") {
          if (this.transaction.unit == timeStamp) {
            return;
          }
          callback(
            `<b>${ContractName}</b>\n<b>Spent</b>: ${from}\n<b>Got</b>: ${recieved[1]} ${recieved[2]}\n<b>Buyer Position</b>: Please get API pro\n<b>Buyer ETH Value</b>: Please get API pro\n<b>Buy #</b>: ${gasPrice}\n<a href="https://etherscan.io/"><b>TX</b></a> |  <a href="https://dextools.io/"><b>Chart</b></a> |  <a href="https://telegram.com/"><b>Telegram</b></a> |  <a href="https://uniswap.com/"><b>Uniswap</b></a>`
          );
        } else {
        }

        this.transaction.unit = timeStamp;
      })
    );
  }
}

module.exports = transaction;
