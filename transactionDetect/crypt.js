"use strict";
const User = require("../userModel");

const axios = require("axios");
const services = require("./balance");
const ID = [];
const image = [];
const pair = [];
const token = [];
const Tname = [];
const Temoji = [];
const Tele = [];
const Clock = [];
class transaction {
  // constructor() {
  //   this.transaction = {};
  //   this.transaction.unit = "";
  // }

  //Get transaction details APIs
  async getTransaction(callback) {
    let user = await User.find();
     for (let i = 0; i < user.length; i++) {
       ID.push(user[i].chatId);
       image.push(user[i].mImage);
       token.push(user[i].ethAddress.token_Address);
       pair.push(user[i].ethAddress.pair_Address);
       Tname.push(user[i].ethAddress.name);
       Temoji.push(user[i].emoji);
       Tele.push(user[i].telegram);
       Clock.push(user[i].timeStamp);

    }
    await ID.shift();
    await image.shift();
    await token.shift();
    await pair.shift();
    await Tname.shift();
    await Temoji.shift();
    await Tele.shift();
    await Clock.shift();
    
    try {console.log(token[0]);
      if (token[0] == undefined || pair[0] == undefined) {
        return console.log("Underfined");
      } else {
        const res = await axios.get(
          `https://api.unmarshal.com/v3/ethereum/address/${token[0]}/transactions?page=1&pageSize=5&contract=string&price=true&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
        );
        const con = await axios.get(
          `https://api.etherscan.io/api?module=contract&action=getsourcecode&apikey=112R9MIZ97GI3M7UBVNAR34HYIGEW4RK8W&address=${token[0]}`
        );

        const vall = await axios.get(
          `https://api.unmarshal.com/v2/ethereum/address/${pair[0]}/transactions?page=1&pageSize=10&contract=string&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
        );
        const val = await axios.get(
          `https://api.unmarshal.com/v1/ethereum/address/${res.data.transactions[0].from}/assets?verified=true&chainId=false&token=false&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
        );

        const coun = await axios.get(
          `https://api.unmarshal.com/v2/ethereum/address/${res.data.transactions[0].from}/transactions?page=1&pageSize=5&contract=${token[0]}&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
        );
        const priceS = await axios.get(
          `https://api.unmarshal.com/v1/pricestore/chain/ethereum/${token[0]}?timestamp=${vall.data.transactions[0].date}&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`
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
          `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${token[0]}&address=${res.data.transactions[0].from}&tag=latest&apikey=112R9MIZ97GI3M7UBVNAR34HYIGEW4RK8W`
        );
        const supplyS = await axios.get(services.supply);
       await axios
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
          .then(await
            axios.spread((...responses) => {
              // const { hash } = responses[0]?.data?.result[0] || {};
              const { ContractName } = responses[1]?.data?.result[0] || {};

              const { id, date, sent, received } =
                responses[2].data.transactions[0] || {};
              const ball = responses[3].data;

              let ethBal = ball.find((o) => o.contract_name === "Ethereum");
              // console.log(ethBal);

              const { balance, quote } = ethBal;

              const { total_txs } = responses[4]?.data || {};
              const { price } = responses[5]?.data;
              let priceNum = Number(price);
              // console.log(price);

              const { total_supply } = responses[6].data;
              // console.log(total_supply);

              const ethValue = responses[7].data.data[0].quote.USD.price;

              const buyerBal = responses[8].data.result;
              console.log(date);

              // Sending ALert details
              // this.transaction.lastValue = user[i].timeStamp;
              if (sent.length === 2 && received.length === 1) {
                if (Clock[0] === date) {
                  return
                } else {
                  let chatId = `${ID[0]}`;
                  console.log("Name the chat Id be this=>", chatId);

                 User.findOneAndUpdate(
                    { chatId },
                    {
                      timeStamp: `${date}`,
                    },
                    (error, data) => {
                      if (error) {
                        console.log("error saving");
                      } else {
                        console.log("Na the name be this=>", `${Tname[0]}`);
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
                        callback(
                          ` 
                            <b>${Tname[0]} Buy</b>\n${
                            Temoji[0]
                          }\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH) \n<b>Got</b>: ${realSum} ${
                            sent[0].symbol
                          }\n<b>Buyer ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                            "fullwide",
                            {
                              useGrouping: false,
                            }
                          )} USD) \n<b>Buyer Position</b>: NEW!!!\n<b>Buy # </b>: 1\n<b>Price</b>:$${priceNum.toFixed(
                            12
                          )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: N\A\n<b>Token Rank</b>: N\A\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${
                            pair[0]
                          }"><b>Chart</b></a> |  <a href="${
                            Temoji[0]
                          }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                        );
                      } else if (buyerPOS > 50) {
                        console.log("else if ...");
                        callback(
                          `
                            <b>${ContractName} Buy</b>\n${
                            Temoji[0]
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
                          )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: N\A\n<b>Token Rank</b>: N\A\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${
                            pair[0]
                          }"><b>Chart</b></a> |  <a href="${
                            Tele[0]
                          }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                        );
                      } else {
                        console.log("Fuck this");
                        callback(
                          `
                            <b>${ContractName} Buy</b>\n${
                            Temoji[0]
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
                          )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: N\A\n<b>Token Rank</b>: N\A\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${
                            pair[0]
                          }"><b>Chart</b></a> |  <a href="${
                            Tele[0]
                          }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                        );
                      }
                    }
                  });
                }
              } else {
              }
              // console.log("I dey here");
              // console.log(user[i].chatId);
              

              // this.transaction.unit = Time[0]
            })
          );
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = { transaction, ID, image };
