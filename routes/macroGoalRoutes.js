const express = require('express');
const router = express.Router();
const MacroGoal = require('../models/MacroGoal');

router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { calories, protein, carbs, fat } = req.body;

  const parsedGoals = {
    calories: Number(calories) || 0,
    protein: Number(protein) || 0,
    carbs: Number(carbs) || 0,
    fat: Number(fat) || 0,
  };

  try {
    const updated = await MacroGoal.findOneAndUpdate(
      { userId },
      parsedGoals,
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Error saving goals:", err);
    res.status(500).json({ error: "Could not save goals" });
  }
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const goal = await MacroGoal.findOne({ userId });
    const { calories, protein, carbs, fat } = goal;
    res.json({ calories, protein, carbs, fat });
  } catch (err) {
    console.error("Error loading goals:", err);
    res.status(500).json({ error: "Could not fetch goals" });
  }
});

module.exports = router;