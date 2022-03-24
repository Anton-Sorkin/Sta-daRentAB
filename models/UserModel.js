const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
});

const userModel = model("Users", userSchema);

module.exports = userModel;
