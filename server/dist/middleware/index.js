"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _settings = require("../settings");

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoStore = require("connect-mongo")(_expressSession2.default);

_mongoose2.default.connect(_settings2.default.mongodb);
var db = _mongoose2.default.connection;
var storeContainer = new MongoStore({ mongooseConnection: db });

exports.default = {
  requiresLoggedIn: function requiresLoggedIn(req, res, next) {
    if (!req.query.sessionId || req.query.sessionId === "") {
      var err = new Error("Invalid Session");
      err.message = "Invalid Session";
      err.status = 401;
      return next(err);
    } else {
      return new Promise(function (resolve) {
        storeContainer.get(req.query.sessionId, function (err, session) {
          if (err) {
            err.message = "Session retrieval error";
          } else {
            if (!session || !session.userId) {
              var error = new Error("Invalid Session");
              error.status = 401;
              error.message = "Invalid Session";
              resolve(next(error));
            } else {
              req.sessionID = req.query.sessionId;
              req.sessionStore = session;
              resolve(next());
            }
          }
        });
      });
    }
  }
};
//# sourceMappingURL=index.js.map