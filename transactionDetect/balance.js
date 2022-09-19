//Apis

const User = require("../userModel");

// var add = (function address() {
//   for(let i = 0; i <User.length;i++) {
//     User.find((error,data)=>{
//       if(error){
//         console.log("error from balance.js")
//         return error
//       }else{
// for (let j = 0; j < data[i]?.ethAddress?.length; j++) {
            
//             let res = data[i]?.ethAddress[j]?.token_Address
//             return res;
//           }
//       }
//     })
//   }
// })
// ()



//0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF

const services = {
  balance: `https://api.etherscan.io/api?module=account&sort=desc&apikey=112R9MIZ97GI3M7UBVNAR34HYIGEW4RK8W&action=txlist&address=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF`,
  contractN: `https://api.etherscan.io/api?module=contract&action=getsourcecode&apikey=112R9MIZ97GI3M7UBVNAR34HYIGEW4RK8W&address=0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF`,
  value: `https://api.unmarshal.com/v3/ethereum/address/0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF/transactions?page=1&pageSize=5&contract=string&price=true&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`,
  values: `https://api.unmarshal.com/v2/ethereum/address/0x0aebd4ea87c2b7059429716c49a2c1b25183c3b8/transactions?page=1&pageSize=10&contract=string&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`,
  price: `https://api.unmarshal.com/v1/pricestore/chain/ethereum/0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF?timestamp=1663249499&auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`,
  supply: `https://api.unmarshal.com/v1/tokenstore/token/address/0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF?auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`,
  count: `https://api.unmarshal.com/v1/ethereum/address/0x410e7696dF8Be2a123dF2cf88808c6ddAb2ae2BF/transactions/count?auth_key=xJ4Xs6Nbwx2EChON3PNFO26gJSpw6vEm9mg097IU`,
};

module.exports = services;
