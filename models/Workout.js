const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
  unit: { type: String, enum: ["kg", "lb"], default: "kg" },
  record: { type: Boolean, default: false },
});

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  muscleGroup: { type: String, required: true },
  sets: [setSchema],
});

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true },
  date: { type: Date, required: true },
  exercise: [exerciseSchema]
});

module.exports = mongoose.model("Workout", workoutSchema);