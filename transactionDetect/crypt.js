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
      let user = await User.find();
      for (let i = 0; i < user.length; i++) {
        for (let j = 0; j < user[i].ethAddress.length; j++) {
          console.log(user[i].ethAddress[j].token_Address);
          const res = await axios.get(services.values);
          const con = await axios.get(
            `https://api.etherscan.io/api?module=contract&action=getsourcecode&apikey=112R9MIZ97GI3M7UBVNAR34HYIGEW4RK8W&address=${user[i].ethAddress[j].token_Address}`
          );

          const vall = await axios.get(services.values);
          const val = await axios.get(
            `https://api.unmarshal.com/v1/ethereum/address/${res.data.transactions[0].from}/assets?verified=true&chainId=false&token=false&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
          );

          const coun = await axios.get(
            `https://api.unmarshal.com/v2/ethereum/address/${res.data.transactions[0].from}/transactions?page=1&pageSize=5&contract=${user[i].ethAddress[j].token_Address}&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
          );
          const priceS = await axios.get(
            `https://api.unmarshal.com/v1/pricestore/chain/ethereum/${user[i].ethAddress[j].token_Address}?timestamp=${vall.data.transactions[0].date}&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
          );
          const conversion = await axios.get(
            "https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=ETH",
            {
              headers: {
                "X-CMC_PRO_API_KEY": "98faa061-7512-412a-a012-9866c329b3c4",
              },
            }
          );
          const buyerTBalance = await axios.get(
            `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${user[i].ethAddress[j].token_Address}&address=${res.data.transactions[0].from}&tag=latest&apikey=112R9MIZ97GI3M7UBVNAR34HYIGEW4RK8W`
          );
          const supplyS = await axios.get(services.supply);
          axios
            .all([
              res,
              con,
              vall,
              val,
              coun,
              priceS,
              supplyS,
              conversion,
              buyerTBalance,
            ])
            .then(
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

                const buyerBal = responses[8].data.result;

                // Sending ALert details
                this.transaction.lastValue = user[i].timeStamp;
                if (sent.length === 2 && received.length === 1) {
                  if (this.transaction.unit == user[i].timeStamp) {
                    return;
                  }
                  let chhat = user[i].chatId;
                  console.log(date);
                  User.findOneAndUpdate(
                    { chhat },
                    {
                      timeStamp: `${date}`,
                    },
                    (error, data) => {
                      if (error) {
                        console.log("error saving");
                      } else {
                        console.log("Data=>", data);
                      }
                    }
                  );

                  let value1 = Number(sent[0].value);
                  let value2 = Number(sent[1].value);
                  let sum = value1 / 10 ** 18 + value2 / 10 ** 18;
                  let realSum = sum.toLocaleString("fullwide");
                  let spentUsd = (sum * price).toLocaleString("fullwide", {
                    useGrouping: false,
                  });
                  let buyerBalCon = Number(buyerBal) / 10 ** 18;

                  let walletVal = balance / 10 ** 18;
                  let ethWalletVal = walletVal.toFixed(5);
                  let spentEth = (spentUsd / ethValue).toFixed(5);
                  let mcap = price * total_supply;
                  let mcapSum = Number(mcap).toLocaleString("fullwide");
                  let mcapfin = mcapSum;
                  console.log("Working Now...");
                  User.find((error, data) => {
                    if (error) {
                      console.log(error);
                    } else {
                      let buyerPOS = (buyerBalCon / realSum) * 100;
                      // if (sum * price <= data[0].step) {
                      if ((buyerPOS = 100)) {
                        console.log("100, 1000");
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
                          )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: N\A\n<b>Token Rank</b>: N\A\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/"><b>Chart</b></a> |  <a href="${
                            data[0].telegram
                          }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                        );
                      } else if (buyerPOS > 50) {
                        console.log("else if ...");
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
                          )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: N\A\n<b>Token Rank</b>: N\A\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/"><b>Chart</b></a> |  <a href="${
                            data[0].telegram
                          }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                        );
                      } else {
                        console.log("Fuck this");
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
                          )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: N\A\n<b>Token Rank</b>: N\A\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/"><b>Chart</b></a> |  <a href="${
                            data[0].telegram
                          }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                        );
                      }
                    }
                  });
                } else {
                }
                console.log("I dey here");
                console.log(user[i].chatId);
                console.log(date);

                this.transaction.unit = user[i].timeStamp
              })
            );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = transaction;
