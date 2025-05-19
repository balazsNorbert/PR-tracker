const mongoose = require("mongoose");

const macroGoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  calories: { type: Number, default: 2520 },
  protein: { type: Number, default: 150 },
  carbs: { type: Number, default: 300 },
  fat: { type: Number, default: 80 },
});

module.exports = mongoose.model("MacroGoal", macroGoalSchema);
