const express = require("express");
const utils = require("../utils/utils.js");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const userRouter = express.Router();

const UserModel = require("../models/UserModel.js");
const BookingModel = require("../models/BookingModel.js");
const StaffModel = require("../models/staffModel");

// === LOGIN === //

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({ username }, (err, user) => {
    if (user && password === user.password) {
      const userData = {
        _id: user._id,
        username,
        role: user.role,
      };
      const accessToken = jwt.sign(userData, process.env.JWTSECRET);
      res.cookie("token", accessToken);

      if (userData.role === "user") {
        res.redirect("/user");
      } else if (userData.role === "staff") {
        res.redirect("/cleanerpage");
      } else if (userData.role === "admin") {
        res.redirect("/admin");
      } else {
        res.redirect("/");
      }
    }
  });
});

// === LOGIN STAFF === //
userRouter.get("/staff/login", (req, res) => {
  res.render("staff-login");
});

userRouter.post("/staff/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  StaffModel.findOne({ username }, (err, user) => {
    if (user && password === user.password) {
      const userData = {
        _id: user._id,
        username,
        role: user.role,
      };
      const accessToken = jwt.sign(userData, process.env.JWTSECRET);
      res.cookie("token", accessToken);
      if (user.role === "admin") {
        res.redirect("/admin");
      } else {
        res.redirect("/staff");
      }
    }
  });
});

// === LOGOUT === //
userRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// === CREATE === //
userRouter.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password == confirmPassword) {
    UserModel.findOne({ username }, async (err, user) => {
      if (user) {
        res.send("Användarnamnet är upptaget");
      } else {
        const newUser = new UserModel({
          username: username,
          password: password,
          email: email,
          role: "user",
        });

        await newUser.save();
        res.redirect("/");
      }
    });
  } else {
    res.sendStatus(403);
  }
});

// === CREATE BOOKING === //
userRouter.post("/dateselect", async (req, res) => {
  const date = req.body.date;
  const customerId = res.locals._id;

  const bookings = await BookingModel.find({ date: date }).lean();

  const occupied = bookings.map((staff) => {
    return staff.staffId;
  });

  const avalibleStaff = await StaffModel.find({
    _id: { $nin: occupied },
  })
    .populate("staffId")
    .lean();

  res.render("bookingPage", { date, avalibleStaff, customerId });
});

userRouter.post("/booking", async (req, res) => {
  /* const date = "2022-03-24"; */
  const {
    cleaningType,
    address,
    zipCode,
    location,
    contactPerson,
    contactPhone,
    staffId,
    date,
    customerId,
  } = req.body;

  /* const bookings = await BookingModel.find({ date: date });
  const occupied = bookings.map((staff) => staff.staffId);
  const avalibleStaff = await StaffModel.find({ _id: { $nin: occupied } }); */

  //console.log(avalibleStaff);

  const newBooking = new BookingModel({
    cleaningType,
    address,
    zipCode,
    location,
    contactPerson,
    contactPhone,
    staffId,
    date,
    customerId,
    done: false,
  });

  await newBooking.save();

  res.redirect("/user");
});

// === READ === //
userRouter.get("/", async (req, res) => {
  const _id = ObjectId(res.locals._id);

  const user = await UserModel.findById({ _id });

  const userCleanings = await BookingModel.find({ customerId: _id }).lean();

  /* const completedCleanings = await BookingModel.find({ done: true }).lean();
  const uncompletedCleanings = await BookingModel.find({ done: false }).lean(); */

  res.render("userpage", {
    userCleanings,
    user,
  });
});

// === USER SINGLE CLEANING === //
userRouter.get("/single/:id", async (req, res) => {
  const _id = req.params.id;

  const singleCleaning = await BookingModel.find({ _id: _id }).lean();
  console.log(singleCleaning);

  res.render("single-cleaning-customer", { singleCleaning });
});

userRouter.post("/cleaning/:id", async (req, res) => {
  console.log(req.params.id);

  await BookingModel.findByIdAndDelete(req.params.id);
  res.redirect("/user");
});

module.exports = userRouter;
