// CONFIG
require("dotenv").config();
// require("./database.js"); (we add this back when we start with mongoose database)

// REQUIREMENTS
const express = require("express");
const hbars = require("express-handlebars");
const cParser = require("cookie-parser");

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

// HOME
app.get("/", (req, res) => {
  res.send("Hello World");
});

// ROUTES
app.use("/admin", adminRoute);

// ERROR ROUTE
//404 route comes last

// LISTENING PORT
app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
