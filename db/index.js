// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI =
  `mongodb+srv://Joshua:3rcPDp8a7Wd93uaE@spotify-app.sz14qrx.mongodb.net/tes't` ||
  "mongodb://127.0.0.1/spotify-app";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });
