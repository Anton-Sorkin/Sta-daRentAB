const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const hashPassword = (password) => {
  const hash = bcrypt.hashSync(password, 8);
  return hash;
};

const comparePassword = (password, hash) => {
  const correct = bcrypt.compareSync(password, hash);
  return correct;
};

const forceAuthorizeUser = (req, res, next) => {
  const { token } = req.cookies;

  if (token && jwt.verify(token, process.env.JWTSECRET)) {
    next();
  } else {
    res.redirect("/");
  }
};

const forceAuthorizeStaff = (req, res, next) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  const role = tokenData.role;

  if (token && jwt.verify(token, process.env.JWTSECRET && role === "staff")) {
    next();
  } else {
    res.redirect("/");
  }
};

const forceAuthorizeAdmin = (req, res, next) => {
  const { token } = req.cookies;
  const tokenData = jwt.decode(token, process.env.JWTSECRET);
  const role = tokenData.role;

  if (token && jwt.verify(token, process.env.JWTSECRET && role === "admin")) {
    next();
  } else {
    res.redirect("/");
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  forceAuthorizeUser,
  forceAuthorizeStaff,
  forceAuthorizeAdmin,
};
