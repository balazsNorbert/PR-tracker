const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema({
  idea: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Idea", IdeaSchema);