import express from "express";
import mongoose from "mongoose";
import Settings from "../settings";
import Functions from "../functions";
import Middleware from "../middleware";
import User from "../models/user";

mongoose.connect(Settings.mongodb);

const db = mongoose.connection;
db.on("error", ()=>{
  //console.error("DB Connection Error");
});




var router = express.Router();

/* GET all available users */
router.get("/", Middleware.requiresLoggedIn,function(req, res, next) {
  User.findById(req.sessionStore.userId)
  .select({
    _id: 1,
    email: 1,
    firstName: 1,
    lastName: 1,
    level: 1,
  })
  .exec((error, user) => {
    if(error){
      const err = new Error("User retrieval error");
      err.message = "User retrieval error";
      next(err);
    }else{
      user.nextLevel(user, nextLevel=>{
        user.getScore(user, scores=>{
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
router.post("/:userId", Middleware.requiresLoggedIn,function(req, res, next) {
  if(req.params.userId !== req.sessionStore.userId){
    let err = new Error("Permission Denied");
    err.message = "Permission Denied";
    err.status = 401;
    next(err);
  }else{
    if(typeof req.body.firstName !== "string" || typeof req.body.lastName !== "string" || typeof req.body.email !== "string"){
      let err = new Error("Invalid Data - Strings required");
      err.message = "Invalid Data - Strings required";
      err.status = 400;
      next(err);
    }else{
      if(!Functions.regex.email.test(req.body.email)){
        let err = new Error("Please enter a valid email address");
        err.message = "Please enter a valid email address";
        err.status = 400;
        next(err);
      }else{

        User.count({_id: {$ne: req.params.userId}, email: req.body.email}, (error, count)=>{

          if(error){
            next(error);
          }else{
            if(count === 0){

              User.findOneAndUpdate({_id: req.params.userId}, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
              }, (error, user)=>{
                if(error){
                  next(error);
                }else{
                  res.json({
                    success: true,
                    message: "Account Updated",
                    user: {
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.email,
                    }
                  });
                }
              });

            }else{
              let err = new Error("That email address is already in use");
              err.message = "That email address is already in use";
              err.status = 400;
              next(err);
            }

          }


        });
      }
    }
  }

});


router.post("/:userId/levelup", Middleware.requiresLoggedIn,function(req, res, next) {
  if(req.params.userId !== req.sessionStore.userId){
    let err = new Error("Permission Denied");
    err.message = "Permission Denied";
    err.status = 401;
    next(err);
  }else{
    User.findById(req.sessionStore.userId)
    .select({
      _id: 1,
      email: 1,
      firstName: 1,
      lastName: 1,
      level: 1,
    })
    .exec((error, user) => {
      if(error){
        next(error);
      }else{
        user.nextLevel(user, nextLevel=>{
          user.getScore(user, scores=>{
            if(scores.levelPoints >= nextLevel.pointsRequired){
              User.findOneAndUpdate({_id: user._id}, {level: nextLevel.position}, (error)=>{
                if(error){
                  next(error);
                }else{
                  res.json({success: true});
                }
              });
            }else{
              let err = new Error("Not enough points to level up");
              err.message = "Not enough points to level up";
              err.status = 403;
              next(err);
            }
          });
        });
      }
    });
  }
});

module.exports = router;
