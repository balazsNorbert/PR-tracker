const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/workouts", require("./routes/workoutRoutes"));
app.use("/api/exercise", require("./routes/exerciseRoutes"));
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/idea", require("./routes/ideaRoutes"));

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});