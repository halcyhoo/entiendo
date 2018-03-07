import mongoose from "mongoose";
import random from "mongoose-simple-random";

var QuestionSchema = new mongoose.Schema({
  es: {
    type: [String],
  },
  en: {
    type: [String],
  },
  difficulty: {
    type: Number,
    default: 1
  },
});

QuestionSchema.plugin(random);


var Question = mongoose.model("question", QuestionSchema);
module.exports = Question;
