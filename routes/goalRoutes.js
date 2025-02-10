const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal.js");
const protect = require("../middleware/authMiddleware");

router.get("/:userId", protect, async (req, res) => {
  const { userId } = req.params;
  try {
    const goals = await Goal.find({ userId });
    res.status(200).json(goals);
  } catch (err) {
    res.status(400).json({ message:'Error fetching goals', error:err });
  }
})

router.post('/', async (req, res) => {
  const { userId, text } = req.body;
  try {
    const newGoal = new Goal({ userId, text });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(400).json({ message: 'Error adding goal', error: err });
  }
});

router.delete('/:id', protect, async (req, res) => {
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

router.patch('/:goalId', protect, async (req, res) => {
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

module.exports = router;