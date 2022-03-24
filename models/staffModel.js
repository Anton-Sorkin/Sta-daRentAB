const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  userName: { type: String },
  password: { type: String },
  email: { type: String },
  bookings: {type: []},
  role: {type: String}
});

const staffModel = mongoose.model("Staff", staffSchema);

module.exports = staffModel;
