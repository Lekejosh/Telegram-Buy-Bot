"use strict";
const User = require("../userModel");
// const fetch = require("node-fetch");

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
    const vall = await axios.get(services.values);
    const val = await axios.get(
      `https://api.unmarshal.com/v1/ethereum/address/${res.data.result[0].from}/assets?verified=true&chainId=false&token=false&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
    );

    const coun = await axios.get(
      `https://api.unmarshal.com/v1/ethereum/address/${res.data.result[0].from}/transactions/count?auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
    );
    const respons = await axios.get(
      "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=BUILD",
      {
        headers: {
          "X-CMC_PRO_API_KEY": "98faa061-7512-412a-a012-9866c329b3c4",
        },
      }
    );
    const usdPrice = await axios.get(
      `https://pro-api.coinmarketcap.com/v2/tools/price-conversion?symbol=ETH&amount=${
        vall.data.transactions[0].fee / 10 ** 18
      }`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": "98faa061-7512-412a-a012-9866c329b3c4",
        },
      }
    );
    console.log(usdPrice.data.data[0].quote);
    axios.all([res, con, vall, val, coun, respons, usdPrice]).then(
      axios.spread((...responses) => {
        const { from, hash } = responses[0].data.result[0];
        const { ContractName } = responses[1].data.result[0];

        const { date, fee, type, description } =
          responses[2].data.transactions[0];
        // const { value } = responses[2].data.transactions[0].others;

        const { balance, quote } = responses[3].data[0];

        const { price } = responses[5].data.data.BUILD[2].quote.USD;
        const { total_transaction_count } = responses[4].data;
        const { total_supply } = responses[5].data.data.BUILD[2];
        cons;

        let recieved = description.split(" ");

        console.log(date);
        // let main = res.data;
        this.transaction.lastValue = date;
        if (type == "receive") {
          if (this.transaction.unit == date) {
            return;
          }
          User.find((error, data) => {
            if (error) {
              console.log(error);
            } else {
              callback(
                `<b>${ContractName} Buy</b>\n${data[0].emoji}\n<b>Spent</b>: ${(
                  fee /
                  10 ** 18
                ).toFixed(7)} ETH\n<b>Got</b>: ${recieved[1]} ${
                  recieved[2]
                }\n<b>Buyer ETH Value</b>: ${(balance / 10 ** 18).toFixed(
                  7
                )}\n<b>Buyer Position</b>: N\A\n<b>Buy # </b>:${total_transaction_count}\n<b>Price</b>:$${price.toFixed(
                  14
                )} \n<b>MCap</b>: $${Math.round(
                  price * total_supply
                )}\n<b>Whale Status</b>: N\A\n<b>Token Rank</b>: N\A\n<a href="https://etherscan.io/tx/${hash}"><b>TX</b></a> |  <a href="https://dextools.io/"><b>Chart</b></a> |  <a href="${
                  data[0].telegram
                }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
              );
            }
          });
        } else {
        }
        this.transaction.unit = date;
      })
    );
  }
}

module.exports = transaction;
