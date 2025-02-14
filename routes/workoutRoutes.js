const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const Goal = require("../models/Goal");
const protect = require("../middleware/authMiddleware");

router.post('/', protect, async (req, res) => {
  const userId = req.user.userId;

  const newWorkout = new Workout({
    userId: userId,
    date: req.body.date,
    exercise: req.body.exercise
  });

  newWorkout.save()
    .then(async (workout) => {
      console.log("Saved workout:", workout);
      const goals = await Goal.find({ userId, achieved: false });
      for(const goal of goals) {
        for(const ex of workout.exercise) {
          if(ex.name === goal.exerciseName) {
            for(const set of ex.sets) {
              if(set.reps >= goal.set.reps && set.weight >= goal.set.weight) {
                goal.achieved = true;
                await goal.save();
                console.log(`Goal achieved: ${goal.exerciseName}`);
                break;
              }
            }
          }
        }
      }
      res.status(201).json(workout);
    })
    .catch(error => {
      console.error("Error saving workout:", error);
      res.status(500).json({ message: "Failed to save workout" });
    });
});

router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const workouts = await Workout.find({ userId: userId });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:workoutId', protect, (req, res) => {
  const userId = req.user.userId;
  const { workoutId } = req.params;
  const { exerciseIndex, setIndex } = req.body;
  Workout.findById({ _id: workoutId, userId: userId})
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

router.put('/:id', protect, async (req, res) => {
  try {
      const userId = req.user.userId;
      const { id } = req.params;
      const updatedWorkout = req.body;
      const workout = await Workout.findByIdAndUpdate({_id: id, userId: userId}, updatedWorkout, { new: true });
      if (!workout) {
          return res.status(404).json({ message: "Workout not found" });
      }
      res.json(workout);
  } catch (error) {
      res.status(500).json({ message: "Error updating workout", error });
  }
});

module.exports = router;