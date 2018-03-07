import mongoose from "mongoose";

var LevelSchema = new mongoose.Schema({
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
  },
});


var Level = mongoose.model("level", LevelSchema);
module.exports = Level;
