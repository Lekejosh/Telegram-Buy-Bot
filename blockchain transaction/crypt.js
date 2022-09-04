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
    const { gas } = res.data.result[0];
    console.log(gas);
    let main = result[0];
    this.transaction.lastValue = res.data.result[0];

    if (this.transaction.unit == gas) {
      return callback("nothing new");
    }
    // callback(`
    //   Agora está na casa dos ${result[0].value}00:
    //   valor atual ${result[0].gas}`);

    this.transaction.unit = result;
  }
}

module.exports = transaction;
