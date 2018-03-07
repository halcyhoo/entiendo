import express from "express";
import mongoose from "mongoose";
import Settings from "../settings";
import User from "../models/user";
import Middleware from "../middleware";
import Functions from "../functions";

mongoose.connect(Settings.mongodb);

const db = mongoose.connection;
db.on("error", ()=>{
  //console.error("DB Connection Error");
});

var router = express.Router();

// POST /login
router.post("/login", function(req, res, next) {
  if(req.body.email && req.body.password){
    User.authenticate(req.body.email, req.body.password, function(error, user){
      if(error || !user){
        var err = new Error("Wrong email or password");
        err.status = 401;
        err.message = "Wrong email or password";
        next(error);
      }else{
        req.session.userId = user._id;
        return res.json({sessionId: req.sessionID});
      }
    });
  }else{
    var err = new Error("Email and password are required");
    err.message = "Email and password are required";
    err.status = 401;
    return next(err);
  }
});

// POST /register
router.post("/register", function(req, res, next) {
  if(req.body.email && req.body.password){
    var UserData = {
      email: req.body.email,
      password: req.body.password,
    };

    if(!Functions.regex.email.test(req.body.email)){
      let err = new Error("Please enter a valid email address");
      err.message = "Please enter a valid email address";
      err.status = 400;
      next(err);
    }else{

      User.count({email: req.body.email}, (error, count)=>{

        if(error){
          next(error);
        }else{

          if(count >= 1){
            let err = new Error("That email address is already in use");
            err.message = "That email address is already in use";
            err.status = 400;
            next(err);
          }else{


            if(req.body.password.length <= 3){
              let err = new Error("Please enter a longer password");
              err.message = "Please enter a longer password";
              err.status = 400;
              next(err);
            }else{
              User.create(UserData, (error, user)=>{
                if(error){
                  next(error);
                }else{
                  req.session.userId = user._id;
                  res.json({sessionId: req.sessionID});
                }
              });
            }

          }

        }

      });
    }
  }else {
    let err = new Error("All Fields Required");
    err.status = 400;
    err.message = "All Fields Required";
    return next(err);
  }
});


// GET /session - Check if session is valid
router.get("/session", Middleware.requiresLoggedIn, function(req, res, next) {
  User.count({_id: req.sessionStore.userId}, (error, count)=>{
    if(error){
      next(error);
    }else{
      if(count == 1){
        res.send({
          success: true,
          message: "Session Valid"
        });
      }else{
        let err = new Error("Invalid Session");
        err.message = "Invalid Session";
        err.status = 401;
        next(err);

      }
    }
  });
});

module.exports = router;
