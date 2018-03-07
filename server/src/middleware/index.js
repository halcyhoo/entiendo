import mongoose from "mongoose";
import session from "express-session";
import Settings from "../settings";

var MongoStore = require("connect-mongo")(session);

mongoose.connect(Settings.mongodb);
const db = mongoose.connection;
const storeContainer = new MongoStore({mongooseConnection: db});


export default {
  requiresLoggedIn(req, res, next){
    if(!req.query.sessionId || req.query.sessionId === ""){
      let err = new Error("Invalid Session");
      err.message = "Invalid Session";
      err.status = 401;
      return next(err);
    }else{
      return new Promise((resolve)=>{
        storeContainer.get(req.query.sessionId, (err,session)=>{
          if(err){
            err.message = "Session retrieval error";
          }else{
            if(!session || !session.userId){
              let error = new Error("Invalid Session");
              error.status = 401;
              error.message = "Invalid Session";
              resolve (next(error));
            }else{
              req.sessionID = req.query.sessionId;
              req.sessionStore = session;
              resolve (next());
            }
          }
        });
      });
    }
  },
};
