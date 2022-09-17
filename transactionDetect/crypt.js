"use strict";
const User = require("../userModel");

const axios = require("axios");
const services = require("./balance");
class transaction {
  constructor() {
    this.transaction = {};
    this.transaction.unit = "";
  }

  //Get transaction details APIs

  async getTransaction(callback) {
    try {
      const res = await axios.get(services.values);
      const con = await axios.get(services.contractN);

      const vall = await axios.get(services.values);
      const val = await axios.get(
        `https://api.unmarshal.com/v1/ethereum/address/${res.data.transactions[0].from}/assets?verified=true&chainId=false&token=false&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
      );

      const coun = await axios.get(
        `https://api.unmarshal.com/v2/ethereum/address/${res.data.transactions[0].from}/transactions?page=1&pageSize=5&contract=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
      );
      const priceS = await axios.get(
        `https://api.unmarshal.com/v1/pricestore/chain/ethereum/0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF?timestamp=${vall.data.transactions[0].date}&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
      );
      const conversion = await axios.get(
        "https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=ETH",
        {
          headers: {
            "X-CMC_PRO_API_KEY": "98faa061-7512-412a-a012-9866c329b3c4",
          },
        }
      );
      const supplyS = await axios.get(services.supply);
      axios.all([res, con, vall, val, coun, priceS, supplyS, conversion]).then(
        axios.spread((...responses) => {
          // const { hash } = responses[0]?.data?.result[0] || {};
          const { ContractName } = responses[1]?.data?.result[0] || {};

          const { id, date, sent, received } =
            responses[2].data.transactions[0] || {};
          const ball = responses[3].data;

          let ethBal = ball.find((o) => o.contract_name === "Ethereum");
          console.log(ethBal);

          const { balance, quote } = ethBal;

          const { total_txs } = responses[4]?.data || {};
          const { price } = responses[5]?.data;
          let priceNum = Number(price);
          console.log(price);

          const { total_supply } = responses[6].data;
          console.log(total_supply);

          const ethValue = responses[7].data.data[0].quote.USD.price;

          console.log(date);

          // Sending ALert details
          this.transaction.lastValue = date;
          if (sent.length === 2 && received.length === 1) {
            if (this.transaction.unit == date) {
              return;
            }
            let value1 = Number(sent[0].value);
            let value2 = Number(sent[1].value);
            let sum = value1 / 10 ** 18 + value2 / 10 ** 18;
            let realSum = sum.toLocaleString("fullwide", {
              useGrouping: false,
            });
            let spentUsd = (sum * price).toLocaleString("fullwide", {
              useGrouping: false,
            });

            let walletVal = balance / 10 ** 18;
            let ethWalletVal = walletVal.toFixed(5);
            let spentEth = (spentUsd / ethValue).toFixed(5);

            User.find((error, data) => {
              if (error) {
                console.log(error);
              } else {
                let buyerPOS = (spentEth / ethWalletVal) * 100;
                // if (sum * price <= data[0].step) {
                if (
                  buyerPOS == "infinity" ||
                  buyerPOS == undefined ||
                  buyerPOS === "infinity" ||
                  buyerPOS === undefined
                ) {
                  callback(
                    `<b>${ContractName} Buy</b>\n${
                      data[0].emoji
                    }\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH) \n<b>Got</b>: ${realSum} ${
                      sent[0].symbol
                    }\n<b>Buyer ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                      "fullwide",
                      {
                        useGrouping: false,
                      }
                    )} USD) \n<b>Buyer Position</b>: NEW!!!\n<b>Buy # </b>:${total_txs}\n<b>Price</b>:$${priceNum.toFixed(
                      12
                    )} \n<b>MCap</b>: $ ${(price * total_supply).toFixed(
                      4
                    )}\n<b>Whale Status</b>: N\A\n<b>Token Rank</b>: N\A\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/"><b>Chart</b></a> |  <a href="${
                      data[0].telegram
                    }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                  );
                } else if (buyerPOS > 50) {
                  callback(
                    `<b>${ContractName} Buy</b>\n${
                      data[0].emoji
                    }\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH)\n<b>Got</b>: ${realSum} ${
                      sent[0].symbol
                    }\n<b>Buyer ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                      "fullwide",
                      {
                        useGrouping: false,
                      }
                    )} USD) \n<b>Buyer Position</b>: ${buyerPOS.toFixed(
                      2
                    )}% ⬆ \n<b>Buy # </b>:${total_txs}\n<b>Price</b>:$${priceNum.toFixed(
                      12
                    )} \n<b>MCap</b>: $ ${(price * total_supply).toFixed(
                      4
                    )}\n<b>Whale Status</b>: N\A\n<b>Token Rank</b>: N\A\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/"><b>Chart</b></a> |  <a href="${
                      data[0].telegram
                    }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                  );
                } else {
                  callback(
                    `<b>${ContractName} Buy</b>\n${
                      data[0].emoji
                    }\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH) \n<b>Got</b>: ${realSum} ${
                      sent[0].symbol
                    }\n<b>Buyer ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                      "fullwide",
                      {
                        useGrouping: false,
                      }
                    )} USD) \n<b>Buyer Position</b>: ${buyerPOS.toFixed(
                      2
                    )}% ⬇\n<b>Buy # </b>:${total_txs}\n<b>Price</b>:$${priceNum.toFixed(
                      12
                    )} \n<b>MCap</b>: $ ${(price * total_supply).toFixed(
                      4
                    )}\n<b>Whale Status</b>: N\A\n<b>Token Rank</b>: N\A\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/"><b>Chart</b></a> |  <a href="${
                      data[0].telegram
                    }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                  );
                }
              }
            });
          } else {
          }
          this.transaction.unit = date;
        })
      );
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = transaction;
