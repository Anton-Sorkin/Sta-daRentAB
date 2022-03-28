//REQUIREMENTS
const express = require("express");
const staffModel = require("../models/staffModel");
const router = express.Router();
const jwt = require("jsonwebtoken");

//GETS

//get admin page with users
router.get("/", async (req, res) => {
  const staff = await userModel.find().lean();

  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    res.render("admin-page", { staff });
  } else {
    res.redirect("/admin");
  }
});

//get admin info page with users
router.get("/info", async (req, res) => {
  const staff = await userModel.find().lean();

  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    res.render("staff-admin-info", { staff });
  } else {
    res.redirect("/admin");
  }
});

//post create new staff from admin
router.post("/", async (req, res) => {
  const newStaff = new staffModel({
    userName: req.body.username,
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

//post a change to value to info/id to mark it as done
router.post("/info/:id", async (req, res) => {
  const { isDone } = req.body;
  await staffModel.findByIdAndUpdate(req.params.id, { isDone });
  //inte klar|||||
  res.redirect("/admin");
});

//EXPORTS
module.exports = router;
