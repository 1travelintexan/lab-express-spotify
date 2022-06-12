// ℹ️ Connects to the database
require("./db");

require("dotenv").config();
let PORT = process.env.PORT || 3000;
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

app.listen(PORT, () =>
  console.log(`My Spotify project running on port ${PORT} 🎧 🥁 🎸 🔊`)
);

module.exports = app;
