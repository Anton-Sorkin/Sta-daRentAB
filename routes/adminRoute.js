//REQUIREMENTS
const express = require("express");
const staffModel = require("../models/staffModel");
const BookingModel = require("../models/BookingModel");
const UserModel = require("../models/UserModel.js");
const router = express.Router();
const jwt = require("jsonwebtoken");

//GETS

//get admin page with users
router.get("/", async (req, res) => {
  const staff = await staffModel.find().lean();
  const bookings = await BookingModel.find().lean();

  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    res.render("admin-page", { staff, bookings });
  } else {
    res.redirect("/admin");
  }
});

//get admin info page with users
router.get("/info/:id", async (req, res) => {
  const _id = req.params.id; //gets the id from url
  const booking = await BookingModel.find({ _id: _id }).lean(); //finds the booking with that url id from database

  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    res.render("staff-admin-info", { booking }); //sends that specific booking with matching id to staff
  } else {
    res.redirect("/admin");
  }
});

router.post("/", async (req, res) => {
  const newStaff = new staffModel({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    role: "staff",
  });

  if (req.body.password === req.body.password2) {
    const result = await newStaff.save();

    res.redirect("/admin");
  } else {
    res.sendStatus(400);
  }
});

router.post("/toggle/done/:id", async (req, res) => {
  const booking = await BookingModel.find({ _id: req.params.id });

  await BookingModel.updateOne(booking, { $set: { done: !booking.done } });
  if (res.locals.role === "admin") {
    res.redirect("/admin");
  } else {
    res.redirect("/staff");
  }
});

//EXPORTS
module.exports = router;
