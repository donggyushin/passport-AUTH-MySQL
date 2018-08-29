var express = require("express");
var app = express();
var mysql = require("mysql");
var mysqlkey = require("../options/mysql");
var bodyParser = require("body-parser");
var conn = mysql.createConnection(mysqlkey);
var session = require("express-session");
var MySQLStroe = require("express-mysql-session")(session);
var sessionKey = require("../options/sessionstore");
var sessionStore = new MySQLStroe(sessionKey);
var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
var flash = require("connect-flash");

//middlewares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "displayName",
    secret: "21212kjdA!@#!",
    store: sessionStore,
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//settings
app.set("view engine", "ejs");
app.set("views", "./views");

//routes
var api = require("./routes/index");
var auth = require("./routes/auth");

app.use("/api", api);
app.use("/auth", auth);

//welcome page
app.get("/", (req, res) => {
  var user = req.user;

  res.send(user);
});

app.listen(8081, () => {
  console.log("Server listening at port 8081");
});
