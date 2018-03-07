import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from "express-session";
import Settings from "./settings";

var MongoStore = require("connect-mongo")(session);
var app = express();

mongoose.connect(Settings.mongodb);

const db = mongoose.connection;
db.on("error", ()=>{
  //console.error("DB Connection Error");
});

const storeContainer = new MongoStore({mongooseConnection: db});

app.use(session({
  secret: Settings.cookieSecret,
  resave: true,
  saveUninitialized: false,
  store: storeContainer
}));


var indexRoutes = require("./routes/index");
var usersRoutes = require("./routes/users");
var questionsRoutes = require("./routes/questions");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use("/", indexRoutes);
app.use("/users", usersRoutes);
app.use("/questions", questionsRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);


  res.json({request: {body: req.body, headers: req.headers}, message: err.message});
});

app.listen(process.env.PORT, function () {
  //console.log('Express app listening on port ',process.env.PORT);
});

module.exports = app;
