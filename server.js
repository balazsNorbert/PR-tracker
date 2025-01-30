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
  const newWorkout = new Workout({
    date: req.body.date,
    exercise: req.body.exercise
  });

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

app.get("/api/exercise", async (req, res) => {
  try{
    const { name } = req.query;
    const exercises = await Workout.aggregate([
      { $match: { "exercise.name": name } },
      { $unwind: "$exercise" },
      { $match: { "exercise.name": name } },
      { $sort: { date: 1 } },
      { $project: { "exercise.sets": 1, date: 1, _id: 0 } }
    ]);
    res.json(exercises);
  } catch (error) {
    console.error("Error fetching exercise data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete('/api/workouts/:workoutId', (req, res) => {
  const { workoutId } = req.params;
  const { exerciseIndex, setIndex } = req.body;
  Workout.findById(workoutId)
    .then(workout => {
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      const exercise = workout.exercise[exerciseIndex];
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      exercise.sets.splice(setIndex, 1);
      if (exercise.sets.length === 0) {
        workout.exercise.splice(exerciseIndex, 1);
      }
      return workout.save();
    })
    .then(updatedWorkout => {
      res.json(updatedWorkout);
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
});

app.put('/api/workouts/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const updatedWorkout = req.body;
      const workout = await Workout.findByIdAndUpdate(id, updatedWorkout, { new: true });
      if (!workout) {
          return res.status(404).json({ message: "Workout not found" });
      }
      res.json(workout);
  } catch (error) {
      res.status(500).json({ message: "Error updating workout", error });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
