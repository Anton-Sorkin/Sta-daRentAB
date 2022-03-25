const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  userName: { type: String },
  password: { type: String },
  email: { type: String },
  role: { type: String },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Staff",
  },
});

const StaffModel = mongoose.model("Staff", staffSchema);

module.exports = StaffModel;
