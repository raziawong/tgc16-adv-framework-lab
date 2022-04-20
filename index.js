// ------------ 01 SETUP
const express = require("express");
const hbs = require("hbs");
const waxOn = require("wax-on");
require("dotenv").config();

const session = require("express-session");
const flash = require("express-flash");
const FileStore = require("session-file-store")(session);
const csrf = require("csurf");

const app = express();
app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(express.urlencoded({
  extended: false
}));

waxOn.on(hbs.handlebars);
waxOn.setLayoutPath("./views/layouts");

// ------------ 02 ROUTES

// custom middleware
// it tells express to do something first
// before routing to anywhere else
// next() will tell express to proceed
app.use((req, res, next) => {
  res.locals.date = Date();
  next();
});

// enable and set up Sessions
app.use(
  session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
// share Session user with hbs files
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

// enable Flash messages
app.use(flash());
// register Flash middleware
app.use(function (req, res, next) {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

// enable CSRF
app.use(csrf());
// share CSRF with hbs files
app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
});
// handle CSRF error
app.use(function (err, req, res, next) {
  if (err && err.code == "EBADCSRFTOKEN") {
    req.flash("error_messages", "The form has expired. Please try again");
    res.redirect("back");
  } else {
    next();
  }
});

// import in the CheckIfAuthenticated middleware
const {
  checkIfAuthenticated
} = require("./middlewares");

// import routes
const landingRoutes = require("./routes/landing");
const posterRoutes = require("./routes/posters");
const userRoutes = require("./routes/users");
const cloudinaryRoutes = require("./routes/cloudinary.js");
const cartRoutes = require("./routes/shoppingCart");
const checkoutRoutes = require("./routes/checkout");

(async function () {
  app.get("/", function (req, res) {
    res.redirect("/landing");
  });

  app.use("/landing", landingRoutes);
  app.use("/posters", posterRoutes);
  app.use("/users", userRoutes);
  app.use("/cloudinary", checkIfAuthenticated, cloudinaryRoutes);
  app.use("/cart", checkIfAuthenticated, cartRoutes);
  app.use("/checkout", checkIfAuthenticated, checkoutRoutes);
})();

// ------------ 03 LISTEN
app.listen(3355, function () {
  console.log("Server has started");
});