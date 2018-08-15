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

var api = require("./routes/index");

//middlewares
app.use("/api", api);
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

//settings
app.set("view engine", "ejs");
app.set("views", "./views");

var sql = "select * from users";
conn.query(sql, (err, results, fields) => {
  if (err) console.log(err);
  else {
    console.log(results);
  }
});

app.listen(8081, () => {
  console.log("Server listening at port 8081");
});
