const express = require("express");
const utils = require("../utils/utils.js");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

// LOGIN

userRouter.post("/user/login", async (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({ username }, (err, user) => {
    if (user && utils.comparePassword(password, user.hashedPasssword)) {
      const userData = {
        _id: user._id,
        username,
        role,
      };
      const accessToken = jwt.sign(userData, process.env.JWTSECRET);
      res.cookie("token", accessToken);

      if (userData.role === "user") {
        res.redirect("/userpage");
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
