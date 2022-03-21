//REQUIREMENTS
const express = require("express");
const router = express.Router();

//GETS
router.get("/", (req, res) => {
  res.render("admin-page");
});

router.get("/info", (req, res) => {
  res.render("staff-admin-info");
});

//EXPORTS
module.exports = router;
