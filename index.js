// CONFIG
require("dotenv").config();

require("./database.js");

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
const userRouter = require("./routes/userRouter.js");
const { default: mongoose } = require("mongoose");

// USERSMODEL
const userModel = require("./models/UserModel.js");

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
app.use(express.json());
app.use(cParser());
app.use(express.static("public"));

app.use((req, res, next) => {
  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    const tokenData = jwt.decode(token, process.env.JWTSECRET);
    res.locals.loggedIn = true;
    res.locals.username = tokenData.username;
    res.locals.role = tokenData.role;
    res.locals._id = tokenData._id;
  } else {
    res.locals.loggedIn = false;
  }
  next();
});

// HOME
app.get("/", (req, res) => {
  res.render("home");
});

// ROUTES

//all usable routes goes here
app.use("/admin", adminRoute);
app.use("/user", userRouter);

app.get("/staff", (req, res) => {
  res.render("cleanerpage");
});

app.get("/staffadmininfo", (req, res) => {
  res.render("staff-admin-info");
});

app.get("/booking", (req, res) => {
  res.render("bookingPage");
});

// ERROR ROUTE
//404 route comes last

// LISTENING PORT
app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
