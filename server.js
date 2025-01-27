const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
}));

mongoose.connect('mongodb://localhost:27017/prtracker').then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const setSchema = new mongoose.Schema({
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
  unit: { type: String, enum: ["kg", "lb"], default: "kg" }
});

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: [setSchema],
});

const workoutSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  exercise: [exerciseSchema]
});

const Workout = mongoose.model("Workout", workoutSchema);

app.post('/api/workouts', (req, res) => {
  console.log("Received workout data:", req.body);
  const newWorkout = new Workout(req.body);
  newWorkout.save()
    .then(workout => {
      console.log("Saved workout:", workout);
      res.status(201).json(workout);
    })
    .catch(error => {
      console.error("Error saving workout:", error);
      res.status(500).json({ message: "Failed to save workout" });
    });
});

app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/workouts/:date/:workoutIndex/:setIndex', (req, res) => {
  const { date, workoutIndex, setIndex } = req.params;
  console.log("Received parameters for deletion:", req.params);
  const dateObj = new Date(date).toISOString().slice(0, 10);
  console.log("Type of date:", dateObj);
  Workout.findOne( dateObj )
    .then(workouts => {
      if (workouts.length > 0) {
        const workout = workouts[0];
        workout.exercise[workoutIndex].sets.splice(setIndex, 1);
        console.log("Workout after deletion:", workout);
        workout.save()
          .then(() => {
            res.status(200).json({ message: "Set deleted successfully" });
          })
          .catch((err) => {
            res.status(500).json({ message: "Error saving workout", error: err });
          });
      } else {
        res.status(404).json({ message: "Workout not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error deleting set", error: err });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
