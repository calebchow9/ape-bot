var mongoose = require("mongoose");

var GameSchema = new mongoose.Schema({
  name: {type: String, unique: true},
  user: {type: String},
  players: {type: Number},
});

module.exports = mongoose.model("Game", GameSchema);
