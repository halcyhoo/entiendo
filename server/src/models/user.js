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
    type: Boolean,
  },
  password: {
    type: String,
    required: true,
  }
});

UserSchema.methods.getScore = (user, callback) => {
  Answer.find({userId: user._id}, (error, answers) => {
    if(error){
      callback(error);
    }else{
      let totalAnswers = answers.length,
          successAnswers = 0,
          levelPoints = 0,
          totalPoints = 0;
      for(let a = 0; a < answers.length; a++){
        if(answers[a].success){
          successAnswers++;
          totalPoints += answers[a].points;
          if(answers[a].level == user.level){
            levelPoints += answers[a].points;
          }
        }
      }
      callback({totalAnswers, successAnswers, levelPoints, totalPoints});

    }
  });
}

UserSchema.methods.nextLevel = (user, callback) => {
  Level.find({position: user.level+1}, (error, nextLevel) => {
    if(error){
      callback(error);
    }else{
      callback(nextLevel[0]);
    }
  });
}

UserSchema.statics.authenticate = function(email, password, callback){
  User.find({email: email}).exec((error, user) => {
    if(error){
      return callback(error);
    }else if(!user[0]){
      let err = new Error("No User Found");
      err.status = 401;
      return callback(err);
    }else{
      bcrypt.compare(password, user[0].password, function(error, result){
        if(error){
          callback(error);
        }else{
          if(result == true){
            return callback(null, user[0]);
          }else{
            return callback();
          }
        }
      });
    }
  });
};

UserSchema.pre("save", function(next){
  let user = this;
  bcrypt.hash(user.password, 10, function(error, hash){
    if(error){
      next(error);
    }else{
      user.password = hash;
      next();
    }
  });
});

var User = mongoose.model("User", UserSchema);
module.exports = User;
