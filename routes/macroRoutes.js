const express = require("express");
const router = express.Router();
const Macro = require("../models/Macro");

router.get("/:userId/:date", async (req, res) => {
  try {
    const {userId, date} = req.params;
    const selectedDate = new Date(date);
    const macro = await Macro.findOne({ userId, date: selectedDate });
    res.json(macro || { userId, date: selectedDate, calories: 0, protein: 0, carbs: 0, fat: 0 });
  } catch (error) {
    res.status(500).json({ error: "Error fetching macros" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, date, calories, protein, carbs, fat } = req.body;
    const selectedDate = new Date(date);
    let macro = await Macro.findOne({ userId, date: selectedDate });

    if (macro) {
      macro.calories += calories || 0;
      macro.protein += protein  || 0;
      macro.carbs += carbs || 0;
      macro.fat += fat  || 0;
    } else {
      macro = new Macro({ userId, date: selectedDate, calories, protein, carbs, fat });
    }
    await macro.save();
    res.json(macro);
  } catch (error) {
    res.status(500).json({ error: "Error saving macros" });
  }
});

router.put("/:userId/:date", async (req, res) => {
  const { userId, date } = req.params;
  const { calories, protein, carbs, fat } = req.body;

  try {
    const updatedMacro = await Macro.findOneAndUpdate(
      { userId, date },
      { $set: { calories, protein, carbs, fat } }
    );
    res.json(updatedMacro);
  } catch (error) {
    console.error("Error updating macros:", error);
    res.status(500).json({ error: "Failed to update macros" });
  }
});

module.exports = router;