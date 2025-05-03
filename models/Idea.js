const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  idea: { type: String, required: true, trim: true },
  reply: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Idea", IdeaSchema);
