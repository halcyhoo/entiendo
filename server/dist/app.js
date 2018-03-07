"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _settings = require("./settings");

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoStore = require("connect-mongo")(_expressSession2.default);
var app = (0, _express2.default)();

_mongoose2.default.connect(_settings2.default.mongodb);

var db = _mongoose2.default.connection;
db.on("error", function () {
  //console.error("DB Connection Error");
});

var storeContainer = new MongoStore({ mongooseConnection: db });

app.use((0, _expressSession2.default)({
  secret: _settings2.default.cookieSecret,
  resave: true,
  saveUninitialized: false,
  store: storeContainer
}));

var indexRoutes = require("./routes/index");
var usersRoutes = require("./routes/users");
var questionsRoutes = require("./routes/questions");

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _cookieParser2.default)());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use("/", indexRoutes);
app.use("/users", usersRoutes);
app.use("/questions", questionsRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);

  res.json({ request: { body: req.body, headers: req.headers }, message: err.message });
});

app.listen(process.env.PORT, function () {
  //console.log('Express app listening on port ',process.env.PORT);
});

module.exports = app;
//# sourceMappingURL=app.js.map