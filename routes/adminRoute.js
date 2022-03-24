//REQUIREMENTS
const express = require("express");
const router = express.Router();

//GETS

//get admin page with users
router.get("/", async (req, res) => {
  const users = await UsersModel.find().lean();

  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    res.render("admin-page", { users });
  } else {
    res.redirect("/admin");
  }
});

//get admin info page with users
router.get("/info", async (req, res) => {
  const users = await UsersModel.find().lean();

  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    res.render("staff-admin-info", { users });
  } else {
    res.redirect("/admin");
  }
});

//POSTS

//post a change to value to info/id to mark it as done
router.post("/info/:id", async (req, res) => {
  const { isDone } = req.body;
  await UsersModel.findByIdAndUpdate(req.params.id, { isDone });

  res.redirect("/admin");
});
//EXPORTS
module.exports = router;
