"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _settings = require("../settings");

var _settings2 = _interopRequireDefault(_settings);

var _user = require("../models/user");

var _user2 = _interopRequireDefault(_user);

var _middleware = require("../middleware");

var _middleware2 = _interopRequireDefault(_middleware);

var _functions = require("../functions");

var _functions2 = _interopRequireDefault(_functions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.connect(_settings2.default.mongodb);

var db = _mongoose2.default.connection;
db.on("error", function () {
  //console.error("DB Connection Error");
});

var router = _express2.default.Router();

// POST /login
router.post("/login", function (req, res, next) {
  if (req.body.email && req.body.password) {
    _user2.default.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error("Wrong email or password");
        err.status = 401;
        err.message = "Wrong email or password";
        next(error);
      } else {
        req.session.userId = user._id;
        return res.json({ sessionId: req.sessionID });
      }
    });
  } else {
    var err = new Error("Email and password are required");
    err.message = "Email and password are required";
    err.status = 401;
    return next(err);
  }
});

// POST /register
router.post("/register", function (req, res, next) {
  if (req.body.email && req.body.password) {
    var UserData = {
      email: req.body.email,
      password: req.body.password
    };

    if (!_functions2.default.regex.email.test(req.body.email)) {
      var err = new Error("Please enter a valid email address");
      err.message = "Please enter a valid email address";
      err.status = 400;
      next(err);
    } else {

      _user2.default.count({ email: req.body.email }, function (error, count) {

        if (error) {
          next(error);
        } else {

          if (count >= 1) {
            var _err = new Error("That email address is already in use");
            _err.message = "That email address is already in use";
            _err.status = 400;
            next(_err);
          } else {

            if (req.body.password.length <= 3) {
              var _err2 = new Error("Please enter a longer password");
              _err2.message = "Please enter a longer password";
              _err2.status = 400;
              next(_err2);
            } else {
              _user2.default.create(UserData, function (error, user) {
                if (error) {
                  next(error);
                } else {
                  req.session.userId = user._id;
                  res.json({ sessionId: req.sessionID });
                }
              });
            }
          }
        }
      });
    }
  } else {
    var _err3 = new Error("All Fields Required");
    _err3.status = 400;
    _err3.message = "All Fields Required";
    return next(_err3);
  }
});

// GET /session - Check if session is valid
router.get("/session", _middleware2.default.requiresLoggedIn, function (req, res, next) {
  _user2.default.count({ _id: req.sessionStore.userId }, function (error, count) {
    if (error) {
      next(error);
    } else {
      if (count == 1) {
        res.send({
          success: true,
          message: "Session Valid"
        });
      } else {
        var err = new Error("Invalid Session");
        err.message = "Invalid Session";
        err.status = 401;
        next(err);
      }
    }
  });
});

module.exports = router;
//# sourceMappingURL=index.js.map