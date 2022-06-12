// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

require("dotenv").config();
const hbs = require("hbs");
const express = require("express");
const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const authRoutes = require("./routes/auth.routes");
app.use(authRoutes);

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);

module.exports = app;
