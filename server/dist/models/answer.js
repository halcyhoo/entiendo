"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AnswerSchema = new _mongoose2.default.Schema({
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
  }
});

var Answer = _mongoose2.default.model("answer", AnswerSchema);

module.exports = Answer;
//# sourceMappingURL=answer.js.map