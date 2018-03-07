"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _settings = require("../settings");

var _settings2 = _interopRequireDefault(_settings);

var _functions = require("../functions");

var _functions2 = _interopRequireDefault(_functions);

var _middleware = require("../middleware");

var _middleware2 = _interopRequireDefault(_middleware);

var _user = require("../models/user");

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.connect(_settings2.default.mongodb);

var db = _mongoose2.default.connection;
db.on("error", function () {
  //console.error("DB Connection Error");
});

var router = _express2.default.Router();

/* GET all available users */
router.get("/", _middleware2.default.requiresLoggedIn, function (req, res, next) {
  _user2.default.findById(req.sessionStore.userId).select({
    _id: 1,
    email: 1,
    firstName: 1,
    lastName: 1,
    level: 1
  }).exec(function (error, user) {
    if (error) {
      var err = new Error("User retrieval error");
      err.message = "User retrieval error";
      next(err);
    } else {
      user.nextLevel(user, function (nextLevel) {
        user.getScore(user, function (scores) {
          res.json({
            _id: user._id,
            email: user.email,
            lastName: user.lastName,
            firstName: user.firstName,
            level: user.level,
            totalAnswers: scores.totalAnswers,
            successAnswers: scores.successAnswers,
            levelPoints: scores.levelPoints,
            totalPoints: scores.totalPoints,
            nextLevel: nextLevel
          });
        });
      });
    }
  });
});

/* POST update user account */
router.post("/:userId", _middleware2.default.requiresLoggedIn, function (req, res, next) {
  if (req.params.userId !== req.sessionStore.userId) {
    var err = new Error("Permission Denied");
    err.message = "Permission Denied";
    err.status = 401;
    next(err);
  } else {
    if (typeof req.body.firstName !== "string" || typeof req.body.lastName !== "string" || typeof req.body.email !== "string") {
      var _err = new Error("Invalid Data - Strings required");
      _err.message = "Invalid Data - Strings required";
      _err.status = 400;
      next(_err);
    } else {
      if (!_functions2.default.regex.email.test(req.body.email)) {
        var _err2 = new Error("Please enter a valid email address");
        _err2.message = "Please enter a valid email address";
        _err2.status = 400;
        next(_err2);
      } else {

        _user2.default.count({ _id: { $ne: req.params.userId }, email: req.body.email }, function (error, count) {

          if (error) {
            next(error);
          } else {
            if (count === 0) {

              _user2.default.findOneAndUpdate({ _id: req.params.userId }, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
              }, function (error, user) {
                if (error) {
                  next(error);
                } else {
                  res.json({
                    success: true,
                    message: "Account Updated",
                    user: {
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.email
                    }
                  });
                }
              });
            } else {
              var _err3 = new Error("That email address is already in use");
              _err3.message = "That email address is already in use";
              _err3.status = 400;
              next(_err3);
            }
          }
        });
      }
    }
  }
});

router.post("/:userId/levelup", _middleware2.default.requiresLoggedIn, function (req, res, next) {
  if (req.params.userId !== req.sessionStore.userId) {
    var err = new Error("Permission Denied");
    err.message = "Permission Denied";
    err.status = 401;
    next(err);
  } else {
    _user2.default.findById(req.sessionStore.userId).select({
      _id: 1,
      email: 1,
      firstName: 1,
      lastName: 1,
      level: 1
    }).exec(function (error, user) {
      if (error) {
        next(error);
      } else {
        user.nextLevel(user, function (nextLevel) {
          user.getScore(user, function (scores) {
            if (scores.levelPoints >= nextLevel.pointsRequired) {
              _user2.default.findOneAndUpdate({ _id: user._id }, { level: nextLevel.position }, function (error) {
                if (error) {
                  next(error);
                } else {
                  res.json({ success: true });
                }
              });
            } else {
              var _err4 = new Error("Not enough points to level up");
              _err4.message = "Not enough points to level up";
              _err4.status = 403;
              next(_err4);
            }
          });
        });
      }
    });
  }
});

module.exports = router;
//# sourceMappingURL=users.js.map