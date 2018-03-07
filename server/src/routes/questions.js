import express from "express";
import mongoose from "mongoose";
import Settings from "../settings";
import Middleware from "../middleware";
import Question from "../models/question";
import User from "../models/user";
import Answer from "../models/answer";

mongoose.connect(Settings.mongodb);

const db = mongoose.connection;
db.on("error", ()=>{
  //console.error("DB Connection Error");
});




var router = express.Router();

/* GET random question in level */
router.get("/", Middleware.requiresLoggedIn,(req, res, next) => {
  User.find({_id: req.sessionStore.userId}, (error, user)=>{
    if(error){
      next(error);
    }else{
      if(!user[0]){
        let err = new Error("No user found");
        err.message = "No user found";
        err.status = 400;
        next(err);
      }else{


        Question.findOneRandom({difficulty: user[0].level}, {}, {},  (error, question)=>{
          if(error){
            next(error);
          }else{
            let formatedQuestion = {
              difficulty: question.difficulty,
              id: question._id,
              es: question.es[Math.floor(Math.random()*question.es.length)],
            };
            res.json(formatedQuestion);
          }
        });
      }

    }
  });
});

router.post("/:questionId", Middleware.requiresLoggedIn,(req, res, next) => {
  User.find({_id: req.sessionStore.userId}, (error, user)=>{
    if(error){
      next(error);
    }else{
      if(!user[0]){
        let err = new Error("No user found");
        err.message = "No user found";
        err.status = 400;
        next(err);
      }else{

        Question.findOne({_id: req.params.questionId}, "en difficulty es",  (error, question)=>{
          if(error){
            next(error);
          }else{
            let match = false;
            for(let a = 0; a < question.en.length; a ++){

              if(req.body.answer.toLowerCase() == question.en[a].toLowerCase()){
                match = true;
                break;
              }
            }
            var answerData;

            if(match){
              answerData = {
                userId: user[0]._id,
                questionId: question._id,
                success: true,
                level: question.difficulty,
                points: question.difficulty,
              };
            }else{
              answerData = {
                userId: user[0]._id,
                questionId: question._id,
                success: false,
                level: question.difficulty,
                points: question.difficulty,
              };
            }

            Answer.create(answerData, (error)=>{
              if(error){
                next(error);
              }else{
                res.json({
                  questionSuccess: answerData.success,
                  questionData: {
                    en: question.en,
                    es: question.es,
                    difficulty: question.difficulty,
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
