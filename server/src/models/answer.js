
import mongoose from "mongoose";

var AnswerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: 1
  },
  questionId: {
    type: String,
    required: 1
  },
  success: {
    type: Boolean
  },
  level: {
    type: Number,
    required: 1
  },
  points: {
    type: Number,
    required: 1
  },
});

var Answer = mongoose.model("answer", AnswerSchema);

module.exports = Answer;
