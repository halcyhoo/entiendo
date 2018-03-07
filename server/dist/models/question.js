"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseSimpleRandom = require("mongoose-simple-random");

var _mongooseSimpleRandom2 = _interopRequireDefault(_mongooseSimpleRandom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuestionSchema = new _mongoose2.default.Schema({
  es: {
    type: [String]
  },
  en: {
    type: [String]
  },
  difficulty: {
    type: Number,
    default: 1
  }
});

QuestionSchema.plugin(_mongooseSimpleRandom2.default);

var Question = _mongoose2.default.model("question", QuestionSchema);
module.exports = Question;
//# sourceMappingURL=question.js.map