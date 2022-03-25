const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  cleaningType: { type: String },
  address: { type: String },
  zipCode: { type: String },
  location: { type: String },
  contactPerson: { type: String },
  contactPhone: { type: String },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  staffId: {
    type: mongoose.Types.ObjectId,
    ref: "Staff",
  },
  date: { type: String },
  done: { type: Boolean },
});

const BookingModel = mongoose.model("Bookings", bookingSchema);

module.exports = BookingModel;
