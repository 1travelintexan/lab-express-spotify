const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
});

const UserModel = model("user", userSchema);
module.exports = UserModel;
