const mongoose = require("mongoose");

const HashtagSchema = new mongoose.Schema({
  tag: { type: String, unique: true, required: true },
  count: { type: Number, default: 0 }, 
  type: { type: String, required: true }, 
});


const Hashtag = mongoose.model("Hashtag", HashtagSchema);

module.exports = Hashtag;
