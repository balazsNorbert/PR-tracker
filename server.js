const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "https://workoutracker.com"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB connected"))
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
  userId: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true },
  date: { type: Date, required: true },
  exercise: [exerciseSchema]
});

const Workout = mongoose.model("Workout", workoutSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  achieved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Goal = mongoose.model('Goal', goalSchema);

userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const userExists = await User.findOne({ username });
  if(userExists){
    return res.status(400).json({ message: "User already exists!" });
  }

  const user = new User({
    username,
    password,
  });

  try{
    const createdUser = await user.save();
    res.status(201).json({ message: "User registered successfully", user: createdUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

app.post("/api/login", async(req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password!" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password!" });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

const protect = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if(!token){
    return res.status(401).json({ message: "No token, authorization denied!" });
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid!" });
  }
}

app.post('/api/workouts', protect, (req, res) => {
  const userId = req.user.userId;

  const newWorkout = new Workout({
    userId: userId,
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

app.post('/api/goals', async (req, res) => {
  const { userId, text } = req.body;
  try {
    const newGoal = new Goal({ userId, text });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(400).json({ message: 'Error adding goal', error: err });
  }
});

app.get('/api/workouts', protect, async (req, res) => {
  try {
    const userId = req.user.userId;
    const workouts = await Workout.find({ userId: userId });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/exercise", protect, async (req, res) => {
  try{
    const { name } = req.query;
    const userId = req.user.userId;
    console.log("User ID:", userId);
    console.log("Name:", name);
    const exercises = await Workout.aggregate([
      { $match: { "userId": new mongoose.Types.ObjectId(userId) , "exercise.name": name } },
      { $unwind: "$exercise" },
      { $match: {"exercise.name": name } },
      { $sort: { date: 1 } },
      { $project: { "exercise.sets": 1, date: 1, _id: 0 } }
    ]);
    res.json(exercises);
  } catch (error) {
    console.error("Error fetching exercise data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/goals/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const goals = await Goal.find({ userId });
    res.status(200).json(goals);
  } catch (err) {
    res.status(400).json({ message:'Error fetching goals', error:err });
  }
})

app.delete('/api/workouts/:workoutId', protect, (req, res) => {
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

app.delete('/api/goals/:id', async (req, res) => {
  try {
    const goalId = req.params.id;
    const deletedGoal = await Goal.findByIdAndDelete(goalId);

    if (!deletedGoal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    res.json({ message: "Goal deleted successfully", deletedGoal });
  } catch (error) {
    res.status(500).json({ message: "Error deleting goal", error });
  }
});

app.put('/api/workouts/:id', protect, async (req, res) => {
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

app.patch('/api/goals/:goalId', async (req, res) => {
  const { goalId } = req.params;
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      { achieved: true },
      { new: true }
    );
    res.status(200).json(updatedGoal);
  } catch (err) {
    res.status(400).json({ message: 'Error updating goal', error: err });
  }
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
