"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _settings = require("../settings");

var _settings2 = _interopRequireDefault(_settings);

var _middleware = require("../middleware");

var _middleware2 = _interopRequireDefault(_middleware);

var _question = require("../models/question");

var _question2 = _interopRequireDefault(_question);

var _user = require("../models/user");

var _user2 = _interopRequireDefault(_user);

var _answer = require("../models/answer");

var _answer2 = _interopRequireDefault(_answer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.connect(_settings2.default.mongodb);

var db = _mongoose2.default.connection;
db.on("error", function () {
  //console.error("DB Connection Error");
});

var router = _express2.default.Router();

/* GET random question in level */
router.get("/", _middleware2.default.requiresLoggedIn, function (req, res, next) {
  _user2.default.find({ _id: req.sessionStore.userId }, function (error, user) {
    if (error) {
      next(error);
    } else {
      if (!user[0]) {
        var err = new Error("No user found");
        err.message = "No user found";
        err.status = 400;
        next(err);
      } else {

        _question2.default.findOneRandom({ difficulty: user[0].level }, {}, {}, function (error, question) {
          if (error) {
            next(error);
          } else {
            var formatedQuestion = {
              difficulty: question.difficulty,
              id: question._id,
              es: question.es[Math.floor(Math.random() * question.es.length)]
            };
            res.json(formatedQuestion);
          }
        });
      }
    }
  });
});

router.post("/:questionId", _middleware2.default.requiresLoggedIn, function (req, res, next) {
  _user2.default.find({ _id: req.sessionStore.userId }, function (error, user) {
    if (error) {
      next(error);
    } else {
      if (!user[0]) {
        var err = new Error("No user found");
        err.message = "No user found";
        err.status = 400;
        next(err);
      } else {

        _question2.default.findOne({ _id: req.params.questionId }, "en difficulty es", function (error, question) {
          if (error) {
            next(error);
          } else {
            var match = false;
            for (var a = 0; a < question.en.length; a++) {

              if (req.body.answer.toLowerCase() == question.en[a].toLowerCase()) {
                match = true;
                break;
              }
            }
            var answerData;

            if (match) {
              answerData = {
                userId: user[0]._id,
                questionId: question._id,
                success: true,
                level: question.difficulty,
                points: question.difficulty
              };
            } else {
              answerData = {
                userId: user[0]._id,
                questionId: question._id,
                success: false,
                level: question.difficulty,
                points: question.difficulty
              };
            }

            _answer2.default.create(answerData, function (error) {
              if (error) {
                next(error);
              } else {
                res.json({
                  questionSuccess: answerData.success,
                  questionData: {
                    en: question.en,
                    es: question.es,
                    difficulty: question.difficulty
                  }
                });
              }
            });
          }
        });
      }
    }
  });
});

module.exports = router;
//# sourceMappingURL=questions.js.map