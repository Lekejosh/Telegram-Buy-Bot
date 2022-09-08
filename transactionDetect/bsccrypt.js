"use strict";

const axios = require("axios");
const services = require("./balance");

class transaction {
  constructor() {
    this.transaction = {};
    this.transaction.unit = "";
  }
  async getbscTransaction(callback) {
    const res = await axios.get(services.bSmart);
    const { timeStamp, gasPrice, blockNumber, from, to, value } =
      res.data.result[0];
    console.log(timeStamp);
    let main = res.data;
    this.transaction.lastValue = timeStamp;

    if (this.transaction.unit == timeStamp) {
      return;
    }
    callback(`
    Token Name: Please get API pro\n
    from: ${from}\n
    to: ${to}\n
    Price: Please get API pro\n
    Total Circulation: Please get API pro\n
    Transcation Timestamp: ${timeStamp}\n
    GasPrice: ${gasPrice}\n
    Block Number: ${blockNumber}\n
    value: ${value}\n
      `);

    this.transaction.unit = timeStamp;
  }
}

module.exports = transaction;
