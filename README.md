# Telegram-Buy-Bot

A Telegram Bot to give notification on Buy taken place on your Contract Address in ETH

To Start run NPM install to install all packages
# How to use the Bot

1. After running "NPM install" to install all the bot dependencies

2. From the folder config and open the config.env file

3. Get a telegram bot api key from Bot father

4. put the Api key in the config.env file

5. For your Database, You can install Mongodb Locally on your computer or Use Mongodb atlas

6. Get you connection URL either from local server or from Mongodb atlas

7. Make sure the Mongodb database local ip address matches with your local terminal own... If it doesn't adjust it

8. In your terminal run "nodemon index.js"

9. On connections the terminal will show "Database connected to: "

10. Open your Telegram

11. Add your already created bot to a group

12. send the command "/addtoken"

13. Add your desired ETH token... If valid the bot will show you the token name and save it automatically to your database

14. Run the command "/buildsetting" to set up your token alert preference

15. Wait for some minute to recieve alert on the last transaction that happened in your account

# APIs Used in this bot

-- [Unmarshal](https://docs.unmarshal.io/)
-- [Etherscan](https://etherscan.io/apis)
-- [Coinmarketcap](https://coinmarketcap.com/api/documentation/v1)
-- [Dexscreener](https://docs.dexscreener.com/) 

Get all your Api Keys from this sites and add them to the config.env file