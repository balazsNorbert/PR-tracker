const mongoose = require("mongoose");

const macroSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true },
  date: { type: Date, default: Date.now },
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
});

module.exports = mongoose.model("Macro", macroSchema);