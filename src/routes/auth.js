var appRoot = require("app-root-path");
var express = require("express");
var router = express.Router();

//passport
var passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

//mysql
var mysql = require("mysql");
var mysqlkey = require(appRoot + "/options/mysql");
var conn = mysql.createConnection(mysqlkey);

//serializers
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  var sql = "select * from users where id = ?";
  conn.query(sql, [id], (err, results, fields) => {
    var user = results[0];
    done(err, user);
  });
});

//passport middlewares
passport.use(
  new LocalStrategy((username, password, done) => {
    var sql = "select * from users where username =?";
    conn.query(sql, [username], (err, results, fields) => {
      if (err) {
        console.log(err);
        res.send("err occur");
      } else {
        if (results.length === 0) {
          return done(null, false, { message: "no username" });
        }
        var user = results[0];
        if (password !== user.password) {
          return done(null, false, {
            message: "incorrect password or username"
          });
        } else {
          return done(null, user);
        }
      }
    });
  })
);

router.get("/login", (req, res) => {
  res.render("loginform");
});

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  var user = {
    username: username,
    password: password
  };

  var sql = "insert into users set ?";
  conn.query(sql, user, (err, results, fields) => {
    if (err) {
      console.log(err);
      res.send("duplicate username");
    } else {
      console.log(results);
      req.logIn(user, err => {
        if (err) return next(err);
        return res.redirect("/");
      });
    }
  });
});

router.post(
  "/signin",
  passport.authenticate("local", {
    failureFlash: true,
    successRedirect: "/",
    failureRedirect: "/auth/signin"
  })
);

module.exports = router;
