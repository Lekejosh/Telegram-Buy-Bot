# Telegram-Buy-Bot

A Telegram Bot to give notification on Buy taken place on your Contract Address in ETH

To Start run NPM install to install all packages
# How to use the Bot

1. After running "NPM install" to install all the bot dependencies

2. Open Index.js to change the telegram api key to your own

3. Make sure the Mongodb database local ip address matches with your local terminal own... If it doesn't adjust it

4. In your terminal run "nodemon index.js"

5. On connections the terminal will show "Database connected to: Localhost"

6. Open your Telegram

7. Add your already created bot to a group

8. send the command "/addtoken"

9. Add your desired ETH token... If valid the bot will show you the token name and save it automatically to your database

10. Run the command "/buildsetting" to set up your token alert preference

11. Wait for some minute to recieve alert on the last transaction that happened in your account
