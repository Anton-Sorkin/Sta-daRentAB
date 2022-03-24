//REQUIREMENTS
const express = require("express");
const { default: mongoose } = require("mongoose");
const staffModel = require("../models/staffModel");
const router = express.Router();



//GETS
router.get("/", (req, res) => {
  res.render("admin-page");
});

router.post("/", async (req, res) => {

  const newStaff = new staffModel({
      userName: req.body.username,
      password: req.body.password,
      email: req.body.email,
      role: "staff"
    });

    if(req.body.password === req.body.password2){
    const result = await newStaff.save();

    res.redirect("/admin");
  
    }
    else{
      res.sendStatus(400)
    }
})

router.get("/info", (req, res) => {
  res.render("staff-admin-info");
});

//EXPORTS
module.exports = router;
