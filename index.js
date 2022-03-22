// CONFIG
require("dotenv").config();
// require("./database.js"); (we add this back when we start with mongoose database)

// REQUIREMENTS
const express = require("express");
const hbars = require("express-handlebars");
const cParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

// UTILS
const utils = require("./utils/utils.js");

// APP INIT
const app = express();

// ROUTE REQUIREMENTS
const adminRoute = require("./routes/adminRoute");

// USERSMODEL
//all models goes here

// VIEW ENGINE
app.engine(
  "hbs",
  hbars.engine({
    extname: "hbs",
    defaultLayout: "main",
    helpers: {},
  })
);
app.set("view engine", "hbs");

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(cParser());
app.use(express.static("public"));

app.use((req, res, next) => {
  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    const tokenData = jwt.decode(token, process.env.JWTSECRET);
    res.locals.loggedIn = true;
    res.locals.username = tokenData.username;
    res.locals.role = tokenData.role;
    res.locals.id = tokenData._id;
  } else {
    res.locals.loggedIn = false;
  }
  next();
});

// HOME
app.get("/", (req, res) => {
  res.render("bookingPage");
});

// ROUTES
app.get("/userpage", (req, res) => {
  res.render("userpage");
});
//all usable routes goes here
app.use("/admin", adminRoute);

app.get("/cleanerpage", (req, res) => {
  res.render("cleanerpage");
});
// ERROR ROUTE
//404 route comes last

// LISTENING PORT
app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
