const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Workout = require("../models/Workout");
const protect = require("../middleware/authMiddleware");

router.get("/", protect, async (req, res) => {
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

module.exports = router;