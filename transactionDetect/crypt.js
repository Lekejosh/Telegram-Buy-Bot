"use strict";
const User = require("../userModel");
const dotenv = require("dotenv");
dotenv.config({ path: "../configgg/config.env" });
const axios = require("axios");
//Defining Const Arrays
const ID = [];
const image = [];
const pair = [];
const token = [];
const Tname = [];
const Temoji = [];
const Tele = [];
const Clock = [];
const Thash = [];
const stepp = [];
const Csupply = [];
class transaction {
  //Get transaction details APIs
  async getTransaction(callback) {
    let user = await User.find();
    // looping through the database
    for (let i = 0; i < user.length; i++) {
      ID.push(user[i].chatId);
      image.push(user[i].mImage);
      token.push(user[i].ethAddress.token_Address);
      pair.push(user[i].ethAddress.pair_Address);
      Tname.push(user[i].ethAddress.name);
      Temoji.push(user[i].emoji);
      Tele.push(user[i].telegram);
      stepp.push(user[i].step);
      Csupply.push(user[i].cSupply);
      Clock.unshift(user[i].timeStamp);
      Thash.unshift(user[i].hash);
    }
    try {
      let chatss = await User.find();
      // Data Length == 1
      if (chatss.length == 1) {
        console.log(token[0]);
        let lastId = ID[ID.length - 1];

        let lastToken = token[token.length - 1];
        let lastpair = pair[pair.length - 1];
        let lastTname = Tname[Tname.length - 1];
        let lastTemoji = Temoji[Temoji.length - 1];
        let lastTele = Tele[Tele.length - 1];

        if (lastToken == undefined || lastpair == undefined) {
          return console.log("Underfined");
        } else {
          const res = await axios.get(
            `https://api.unmarshal.com/v3/ethereum/address/${lastToken}/transactions?page=1&pageSize=5&contract=string&price=true&auth_key=${process.env.UNMARSHAL}`
          );
          const con = await axios.get(
            `https://api.etherscan.io/api?module=contract&action=getsourcecode&apikey=${process.env.ETHERSCAN}&address=${lastToken}`
          );

          const vall = await axios.get(
            `https://api.unmarshal.com/v2/ethereum/address/${lastpair}/transactions?page=1&pageSize=10&contract=string&auth_key=${process.env.UNMARSHAL}`
          );
          const val = await axios.get(
            `https://api.unmarshal.com/v1/ethereum/address/${vall.data.transactions[0].from}/assets?verified=true&chainId=false&token=false&auth_key=${process.env.UNMARSHAL}`
          );

          const coun = await axios.get(
            `https://api.unmarshal.com/v2/ethereum/address/${vall.data.transactions[0].from}/transactions?page=1&pageSize=5&contract=${lastToken}&auth_key=${process.env.UNMARSHAL}`
          );
          const priceS = await axios.get(
            `https://api.unmarshal.com/v1/pricestore/chain/ethereum/${lastToken}?timestamp=${vall.data.transactions[0].date}&auth_key=${process.env.UNMARSHAL}`
          );
          const supplyS = await axios.get(
            `https://api.unmarshal.com/v1/tokenstore/token/address/${lastToken}?auth_key=${process.env.UNMARSHAL}`
          );
          const conversion = await axios.get(
            "https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=ETH",
            {
              headers: {
                "X-CMC_PRO_API_KEY": process.env.COINMARKET_CAP,
              },
            }
          );
          const buyerTBalance = await axios.get(
            `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${lastToken}&address=${vall.data.transactions[0].from}&tag=latest&apikey=${process.env.ETHERSCAN}`
          );

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
            .then(
              axios.spread(async (...responses) => {
                //getting results from the API
                const { ContractName } = responses[1]?.data?.result[0] || {};
                const { id, date, sent, received } =
                  responses[2].data.transactions[0] || {};
                const ball = responses[3].data;
                let ethBal = ball.find((o) => o.contract_name === "Ethereum");
                let whaleee = ball.find((o) => o.quote >= 100);
                let machala = whaleee?.contract_name || {};
                const { balance, quote } = ethBal;
                const { total_txs } = responses[4]?.data || {};
                const { price } = responses[5]?.data;
                let priceNum = Number(price);
                const { total_supply } = responses[6].data;
                const ethValue = responses[7].data.data[0].quote.USD.price;
                const buyerBal = responses[8].data.result;
                console.log(date);
                console.log("Clock=>", Clock[0]);

                // Detectinf if a buy Transaction
                if (received.length === 1) {
                  // Checking the database if last transation time stamp is the same
                  if (Clock[0] == date) {
                    return;
                  } else {
                    let chatId = `${lastId}`;
                    console.log("Name the chat Id be this=>", chatId);

                    await User.findOneAndUpdate(
                      { chatId },
                      {
                        timeStamp: date,
                        cSupply: total_supply,
                      },
                      (error, timeeee) => {
                        if (error) {
                          console.log("error saving");
                        } else {
                          console.log("Na the name be this=>", `${lastTname}`);

                          let value1 = Number(sent[0]?.value);
                          let value2 = Number(sent[1]?.value);
                          let value3 = Number(sent[2]?.value || 0);
                          let value4 = Number(sent[3]?.value || 0);
                          let value5 = Number(sent[4]?.value || 0);
                          let sum =
                            value1 / 10 ** sent[0]?.decimals +
                            value2 / 10 ** sent[0]?.decimals +
                            value3 / 10 ** sent[0]?.decimals +
                            value4 / 10 ** sent[0]?.decimals +
                            value5 / 10 ** sent[0]?.decimals;
                          let sumation = Number(sum);
                          let realSum = sumation.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          });
                          let spentUsd = (sumation * price).toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 }
                          );
                          let buyerBalCon =
                            Number(buyerBal) / 10 ** sent[0]?.decimals;
                          let walletVal = balance / 10 ** sent[0]?.decimals;
                          let ethWalletVal = walletVal.toFixed(5);
                          let spentEth = (spentUsd / ethValue).toFixed(5);
                          let mcap = price * total_supply;
                          let stepVal = spentUsd;
                          let stepEVal = Math.floor(stepVal / stepp[0]);

                          let mcapSum = Number(mcap).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          });
                          let mcapfin = mcapSum;
                          console.log("Working Now...");
                          let buyerPOS = (sumation / buyerBalCon) * 100;
                          console.log(sumation);
                          console.log(buyerBalCon);
                          console.log(buyerPOS);
                          if (buyerPOS == 100 || buyerPOS == Infinity) {
                            if (whaleee == undefined) {
                              callback(
                                ` 
                            <b>${lastTname} Buy</b>\n${lastTemoji.repeat(
                                  stepEVal
                                )}\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH) \n<b>Got</b>: ${realSum} ${
                                  sent[0].symbol
                                }\n<b>Buyer's Wallet ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                                  undefined,
                                  { maximumFractionDigits: 2 }
                                )} USD) \n<b>Buyer Position</b>: NEW!!!\n<b>Buy # </b> 1\n<b>Price</b>:$${priceNum.toFixed(
                                  12
                                )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: Not A Whale\n<b>Token Rank</b>: Coming Soon\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${lastpair}"><b>Chart</b></a> |  <a href="${lastTele}"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                              );
                            } else {
                              callback(
                                ` 
                            <b>${lastTname} Buy</b>\n${lastTemoji.repeat(
                                  stepEVal
                                )}\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH) \n<b>Got</b>: ${realSum} ${
                                  sent[0].symbol
                                }\n<b>Buyer's Wallet ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                                  undefined,
                                  { maximumFractionDigits: 2 }
                                )} USD) \n<b>Buyer Position</b>: NEW!!!\n<b>Buy # </b> 1\n<b>Price</b>:$${priceNum.toFixed(
                                  12
                                )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: ${machala} 🐋\n<b>Token Rank</b>: Coming Soon\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${lastpair}"><b>Chart</b></a> |  <a href="${lastTele}"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                              );
                            }
                          } else if (buyerPOS > 50) {
                            console.log("else if ...");
                            if (whaleee == undefined) {
                              callback(
                                `
                            <b>${ContractName} Buy</b>\n${lastTemoji.repeat(
                                  stepEVal
                                )}\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH)\n<b>Got</b>: ${realSum} ${
                                  sent[0].symbol
                                }\n<b>Buyer's Wallet ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                                  undefined,
                                  { maximumFractionDigits: 2 }
                                )} USD) \n<b>Buyer Position</b>: ${buyerPOS.toFixed(
                                  2
                                )}% ⬆ \n<b>Buy # </b>${total_txs}\n<b>Price</b>:$${priceNum.toFixed(
                                  12
                                )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: Not A Whale\n<b>Token Rank</b>: Coming Soon\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${lastpair}"><b>Chart</b></a> |  <a href="${lastTele}"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                              );
                            } else {
                              callback(
                                `
                            <b>${ContractName} Buy</b>\n${lastTemoji.repeat(
                                  stepEVal
                                )}\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH)\n<b>Got</b>: ${realSum} ${
                                  sent[0].symbol
                                }\n<b>Buyer's Wallet ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                                  undefined,
                                  { maximumFractionDigits: 2 }
                                )} USD) \n<b>Buyer Position</b>: ${buyerPOS.toFixed(
                                  2
                                )}% ⬆ \n<b>Buy # </b>${total_txs}\n<b>Price</b>:$${priceNum.toFixed(
                                  12
                                )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: ${machala} 🐋\n<b>Token Rank</b>: Coming Soon\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${lastpair}"><b>Chart</b></a> |  <a href="${lastTele}"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                              );
                            }
                          } else {
                            console.log("Fuck this");
                            if (whaleee == undefined) {
                              callback(
                                `
                            <b>${ContractName} Buy</b>\n${lastTemoji.repeat(
                                  stepEVal
                                )}\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH) \n<b>Got</b>: ${realSum} ${
                                  sent[0].symbol
                                }\n<b>Buyer's Wallet ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                                  undefined,
                                  { maximumFractionDigits: 2 }
                                )} USD) \n<b>Buyer Position</b>: ${buyerPOS.toFixed(
                                  2
                                )}% ⬆\n<b>Buy # </b>${total_txs}\n<b>Price</b>:$${priceNum.toFixed(
                                  12
                                )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: Not A Whale\n<b>Token Rank</b>: Coming Soon\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${lastpair}"><b>Chart</b></a> |  <a href="${lastTele}"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                              );
                            } else {
                              callback(
                                `
                            <b>${ContractName} Buy</b>\n${lastTemoji.repeat(
                                  stepEVal
                                )}\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH) \n<b>Got</b>: ${realSum} ${
                                  sent[0].symbol
                                }\n<b>Buyer's Wallet ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                                  undefined,
                                  { maximumFractionDigits: 2 }
                                )} USD) \n<b>Buyer Position</b>: ${buyerPOS.toFixed(
                                  2
                                )}% ⬆\n<b>Buy # </b>${total_txs}\n<b>Price</b>:$${priceNum.toFixed(
                                  12
                                )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: ${machala} 🐋\n<b>Token Rank</b>: Coming Soon\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${lastpair}"><b>Chart</b></a> |  <a href="${lastTele}"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                              );
                            }
                          }
                        }
                      }
                    );
                  }
                } else {
                  return;
                }
              })
            );
        }
      } else {
        await ID.shift();
        await image.shift();
        await token.shift();
        await pair.shift();
        await Tname.shift();
        await Temoji.shift();
        await Csupply.shift();
        await Tele.shift();
        await Clock.pop();
        await Thash.pop();

        console.log("The ID Array=>", ID);
        console.log(token[0]);
        console.log("toksss=>", token);
        console.log("dateee=>", Clock);
        if (token[0] == undefined || pair[0] == undefined) {
          return console.log("Underfined");
        } else {
          const res = await axios.get(
            `https://api.unmarshal.com/v3/ethereum/address/${token[0]}/transactions?page=1&pageSize=5&contract=string&price=true&auth_key=${process.env.UNMARSHAL}`
          );
          const con = await axios.get(
            `https://api.etherscan.io/api?module=contract&action=getsourcecode&apikey=${process.env.ETHERSCAN}&address=${token[0]}`
          );

          const vall = await axios.get(
            `https://api.unmarshal.com/v2/ethereum/address/${pair[0]}/transactions?page=1&pageSize=10&contract=string&auth_key=${process.env.UNMARSHAL}`
          );
          const val = await axios.get(
            `https://api.unmarshal.com/v1/ethereum/address/${vall.data.transactions[0].from}/assets?verified=true&chainId=false&token=false&auth_key=${process.env.UNMARSHAL}`
          );

          const coun = await axios.get(
            `https://api.unmarshal.com/v2/ethereum/address/${vall.data.transactions[0].from}/transactions?page=1&pageSize=5&contract=${token[0]}&auth_key=${process.env.UNMARSHAL}`
          );
          const priceS = await axios.get(
            `https://api.unmarshal.com/v1/pricestore/chain/ethereum/${token[0]}?timestamp=${vall.data.transactions[0].date}&auth_key=${process.env.UNMARSHAL}`
          );
          const conversion = await axios.get(
            "https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=1&symbol=ETH",
            {
              headers: {
                "X-CMC_PRO_API_KEY": process.env.COINMARKET_CAP,
              },
            }
          );
          const buyerTBalance = await axios.get(
            `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${token[0]}&address=${vall.data.transactions[0].from}&tag=latest&apikey=${process.env.ETHERSCAN}`
          );
          const supplyS = await axios.get(
            `https://api.unmarshal.com/v1/tokenstore/token/address/${token[0]}?auth_key=${process.env.UNMARSHAL}`
          );
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
            .then(
              await axios.spread((...responses) => {
                const { ContractName } = responses[1]?.data?.result[0] || {};

                const { id, date, sent, received } =
                  responses[2].data.transactions[0] || {};
                const ball = responses[3].data;

                let ethBal = ball.find((o) => o.contract_name === "Ethereum");

                let whaleee = ball.find((o) => o.quote >= 100);

                let machala = whaleee?.contract_name || {};

                const { balance, quote } = ethBal;

                const { total_txs } = responses[4]?.data || {};
                const { price } = responses[5]?.data;
                let priceNum = Number(price);
                const { total_supply } = responses[6].data;

                const ethValue = responses[7].data.data[0].quote.USD.price;

                const buyerBal = responses[8].data.result;
                console.log(date);

                let lastTime = Clock[Clock.length - 1];
                if (received.length === 1) {
                  if (lastTime == date) {
                    return;
                  } else {
                    let chatId = `${ID[0]}`;
                    console.log("Name the chat Id be this=>", chatId);

                    User.findOneAndUpdate(
                      { chatId },
                      {
                        timeStamp: date,
                        cSupply: total_supply,
                      },
                      (error, timeeee) => {
                        if (error) {
                          console.log("error saving");
                        } else {
                          console.log(
                            "Na the name be this=>",
                            `{ContractName}`
                          );
                          let value1 = Number(sent[0]?.value);
                          let value2 = Number(sent[1]?.value);
                          let value3 = Number(sent[2]?.value || 0);
                          let value4 = Number(sent[3]?.value || 0);
                          let value5 = Number(sent[4]?.value || 0);
                          let sum =
                            value1 / 10 ** sent[0]?.decimals +
                            value2 / 10 ** sent[0]?.decimals +
                            value3 / 10 ** sent[0]?.decimals +
                            value4 / 10 ** sent[0]?.decimals +
                            value5 / 10 ** sent[0]?.decimals;
                          let sumation = Number(sum);
                          let realSum = sumation.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          });
                          let spentUsd = (sumation * price).toLocaleString(
                            undefined,
                            { maximumFractionDigits: 2 }
                          );
                          let buyerBalCon =
                            Number(buyerBal) / 10 ** sent[0]?.decimals;

                          let walletVal = balance / 10 ** sent[0]?.decimals;
                          let ethWalletVal = walletVal.toFixed(5);
                          let spentEth = (spentUsd / ethValue).toFixed(5);
                          let mcap = price * total_supply;
                          let stepVal = spentUsd;
                          let stepEVal = Math.floor(stepVal / stepp[0]);

                          let mcapSum = Number(mcap).toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          });
                          let mcapfin = mcapSum;
                          console.log("Working Now...");
                          let buyerPOS = (sumation / buyerBalCon) * 100;
                          console.log(sumation);
                          console.log(buyerBalCon);
                          console.log(buyerPOS);
                          if (
                            mcapfin == NaN ||
                            spentUsd == NaN ||
                            spentEth == NaN ||
                            priceNum == NaN
                          ) {
                            return;
                          } else {
                            if (buyerPOS == 100 || buyerPOS == Infinity) {
                              if (whaleee == undefined) {
                                callback(
                                  ` 
                            <b>${ContractName} Buy</b>\n${Temoji[0].repeat(
                                    stepEVal
                                  )}\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH) \n<b>Got</b>: ${realSum} ${
                                    sent[0].symbol
                                  }\n<b>Buyer's Wallet ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                                    undefined,
                                    {
                                      maximumFractionDigits: 2,
                                    }
                                  )} USD) \n<b>Buyer Position</b>: NEW!!!\n<b>Buy # </b> 1\n<b>Price</b>:$${priceNum.toFixed(
                                    12
                                  )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: Not A Whale\n<b>Token Rank</b>: Coming Soon\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${
                                    pair[0]
                                  }"><b>Chart</b></a> |  <a href="${
                                    Tele[0]
                                  }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                                );
                              } else {
                                callback(
                                  ` 
                            <b>${ContractName} Buy</b>\n${Temoji[0].repeat(
                                    stepEVal
                                  )}\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH) \n<b>Got</b>: ${realSum} ${
                                    sent[0].symbol
                                  }\n<b>Buyer's Wallet ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                                    undefined,
                                    {
                                      maximumFractionDigits: 2,
                                    }
                                  )} USD) \n<b>Buyer Position</b>: NEW!!!\n<b>Buy # </b> 1\n<b>Price</b>:$${priceNum.toFixed(
                                    12
                                  )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: ${machala} 🐋\n<b>Token Rank</b>: Coming Soon\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${
                                    pair[0]
                                  }"><b>Chart</b></a> |  <a href="${
                                    Tele[0]
                                  }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                                );
                              }
                            } else if (buyerPOS > 50) {
                              console.log("else if ...");
                              if (whaleee == undefined) {
                                callback(
                                  `
                            <b>${ContractName} Buy</b>\n${Temoji[0].repeat(
                                    stepEVal
                                  )}\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH)\n<b>Got</b>: ${realSum} ${
                                    sent[0].symbol
                                  }\n<b>Buyer's Wallet ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                                    undefined,
                                    {
                                      maximumFractionDigits: 2,
                                    }
                                  )} USD) \n<b>Buyer Position</b>: ${buyerPOS.toFixed(
                                    2
                                  )}% ⬆ \n<b>Buy # </b>${total_txs}\n<b>Price</b>:$${priceNum.toFixed(
                                    12
                                  )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: Not A Whale\n<b>Token Rank</b>: Coming Soon\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${
                                    pair[0]
                                  }"><b>Chart</b></a> |  <a href="${
                                    Tele[0]
                                  }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                                );
                              } else {
                                callback(
                                  `
                            <b>${ContractName} Buy</b>\n${Temoji[0].repeat(
                                    stepEVal
                                  )}\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH)\n<b>Got</b>: ${realSum} ${
                                    sent[0].symbol
                                  }\n<b>Buyer's Wallet ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                                    undefined,
                                    {
                                      maximumFractionDigits: 2,
                                    }
                                  )} USD) \n<b>Buyer Position</b>: ${buyerPOS.toFixed(
                                    2
                                  )}% ⬆ \n<b>Buy # </b>${total_txs}\n<b>Price</b>:$${priceNum.toFixed(
                                    12
                                  )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: ${machala} 🐋\n<b>Token Rank</b>: Coming Soon\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${
                                    pair[0]
                                  }"><b>Chart</b></a> |  <a href="${
                                    Tele[0]
                                  }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                                );
                              }
                            } else {
                              console.log("Fuck this");
                              if (whaleee == undefined) {
                                callback(
                                  `
                            <b>${ContractName} Buy</b>\n${Temoji[0].repeat(
                                    stepEVal
                                  )}\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH) \n<b>Got</b>: ${realSum} ${
                                    sent[0].symbol
                                  }\n<b>Buyer's Wallet ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                                    undefined,
                                    {
                                      maximumFractionDigits: 2,
                                    }
                                  )} USD) \n<b>Buyer Position</b>: ${buyerPOS.toFixed(
                                    2
                                  )}% ⬆\n<b>Buy # </b>${total_txs}\n<b>Price</b>:$${priceNum.toFixed(
                                    12
                                  )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: Not A Whale\n<b>Token Rank</b>: Coming Soon\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${
                                    pair[0]
                                  }"><b>Chart</b></a> |  <a href="${
                                    Tele[0]
                                  }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                                );
                              } else {
                                callback(
                                  `
                            <b>${ContractName} Buy</b>\n${Temoji[0].repeat(
                                    stepEVal
                                  )}\n<b>Spent</b>: ${spentUsd} USD (${spentEth} ETH) \n<b>Got</b>: ${realSum} ${
                                    sent[0].symbol
                                  }\n<b>Buyer's Wallet ETH Value</b>: ${ethWalletVal} (${quote.toLocaleString(
                                    undefined,
                                    {
                                      maximumFractionDigits: 2,
                                    }
                                  )} USD) \n<b>Buyer Position</b>: ${buyerPOS.toFixed(
                                    2
                                  )}% ⬆\n<b>Buy # </b>${total_txs}\n<b>Price</b>:$${priceNum.toFixed(
                                    12
                                  )} \n<b>MCap</b>: $ ${mcapfin}\n<b>Whale Status</b>: ${machala} 🐋\n<b>Token Rank</b>: Coming Soon\n<a href="https://etherscan.io/tx/${id}"><b>TX</b></a> |  <a href="https://dextools.io/app/ether/pair-explorer/${
                                    pair[0]
                                  }"><b>Chart</b></a> |  <a href="${
                                    Tele[0]
                                  }"><b>Telegram</b></a> |  <a href="https://app.uniswap.org/#/swap?&chain=mainnet&use=v2&outputCurrency=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF"><b>Uniswap</b></a>`
                                );
                              }
                            }
                          }
                        }
                      }
                    );
                  }
                } else {
                  return;
                }
              })
            );
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

// Exporting

module.exports = { transaction, ID, image };
