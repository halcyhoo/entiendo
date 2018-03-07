"use strict";

var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var Answer = require("./answer");
var Level = require("./level");

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  level: {
    type: Number,
    default: 1
  },
  admin: {
    type: Boolean
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.methods.getScore = function (user, callback) {
  Answer.find({ userId: user._id }, function (error, answers) {
    if (error) {
      callback(error);
    } else {
      var totalAnswers = answers.length,
          successAnswers = 0,
          levelPoints = 0,
          totalPoints = 0;
      for (var a = 0; a < answers.length; a++) {
        if (answers[a].success) {
          successAnswers++;
          totalPoints += answers[a].points;
          if (answers[a].level == user.level) {
            levelPoints += answers[a].points;
          }
        }
      }
      callback({ totalAnswers: totalAnswers, successAnswers: successAnswers, levelPoints: levelPoints, totalPoints: totalPoints });
    }
  });
};

UserSchema.methods.nextLevel = function (user, callback) {
  Level.find({ position: user.level + 1 }, function (error, nextLevel) {
    if (error) {
      callback(error);
    } else {
      callback(nextLevel[0]);
    }
  });
};

UserSchema.statics.authenticate = function (email, password, callback) {
  User.find({ email: email }).exec(function (error, user) {
    if (error) {
      return callback(error);
    } else if (!user[0]) {
      var err = new Error("No User Found");
      err.status = 401;
      return callback(err);
    } else {
      bcrypt.compare(password, user[0].password, function (error, result) {
        if (error) {
          callback(error);
        } else {
          if (result == true) {
            return callback(null, user[0]);
          } else {
            return callback();
          }
        }
      });
    }
  });
};

UserSchema.pre("save", function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (error, hash) {
    if (error) {
      next(error);
    } else {
      user.password = hash;
      next();
    }
  });
});

var User = mongoose.model("User", UserSchema);
module.exports = User;
//# sourceMappingURL=user.js.map