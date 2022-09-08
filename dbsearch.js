const User = require("./userModel");
const mongoose = require("mongoose");

var collections = User();
for (var i = 0; i < collections.length; i++) {
  console.log("Collection: " + collections[i]); // print the name of each collection
  db.getCollection(collections[i]).find().forEach(printjson); //and then print the json of each of its elements
}

const init = async () => {
  mongoose
    .connect("mongodb://localhost:27017/buybot")
    .then((data) => {
      console.log(`Mongodb connected with serve: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
  //   bot.launch();
};

init();
