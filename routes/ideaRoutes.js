const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Idea = require("../models/Idea");

router.post("/send-idea", protect, async (req, res) => {
  try {
    const { idea } = req.body;

    if(!idea) {
      return res.status(400).json({ message: "Idea is empty!" });
    }

    const newIdea = new Idea({ idea });
    await newIdea.save();
    res.json({ message: "Idea saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;