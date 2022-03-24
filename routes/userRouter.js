const express = require("express");
const utils = require("../utils/utils.js");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userRouter = express.Router();

const UserModel = require("../models/UserModel.js");

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
        res.redirect("/user");
      }
    });
  } else {
    res.sendStatus(409);
  }
});

// === READ === //
userRouter.get("/", async (req, res) => {
  const _id = mongoose.Types.ObjectId(res.locals._id);
  const user = UserModel.findOne({ _id: _id }).lean();
  console.log(user.username);

  res.render("userpage");
});

module.exports = userRouter;
