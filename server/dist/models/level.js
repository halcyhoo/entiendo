"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LevelSchema = new _mongoose2.default.Schema({
  title: {
    type: String,
    required: 1
  },
  position: {
    type: Number,
    default: 1
  },
  pointsRequired: {
    type: Number,
    default: 1
  }
});

var Level = _mongoose2.default.model("level", LevelSchema);
module.exports = Level;
//# sourceMappingURL=level.js.map