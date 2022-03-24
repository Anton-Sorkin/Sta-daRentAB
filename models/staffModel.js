const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  userName: { type: String },
  password: { type: String },
  email: { type: String },
});

const staffModel = mongoose.model("Staff", userSchema);

module.exports = staffModel;
