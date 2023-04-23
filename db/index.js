// ℹ️ package responsible to make the connection with mongodb
// https://www.npmjs.com/package/mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();

// ℹ️ Sets the MongoDB URI for our app to have access to it.
// If no env has been set, we dynamically set it to whatever the folder name was upon the creation of the app

const MONGO_URI = `
mongodb+srv://josh-ify-main-db-07347723f6c:GfFs45TAsJJ3DnY1AQffcJgqfd75EV@prod-us-central1-2.ih9la.mongodb.net/josh-ify-main-db-07347723f6c`;
mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo and here is the error: ", err);
  });
