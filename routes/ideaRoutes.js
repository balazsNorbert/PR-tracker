const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminOnlyMiddleware");
const Idea = require("../models/Idea");

router.post("/send-idea", protect, async (req, res) => {
  try {
    const { idea, userId } = req.body;

    if(!idea) {
      return res.status(400).json({ message: "Idea is empty!" });
    }

    if (!userId) {
      return res.status(400).json({ message: "userId is missing!" });
    }

    const newIdea = new Idea({
      userId: userId,
      idea
    });
    await newIdea.save();
    res.json({ message: "Idea saved successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/latest", protect, async (req, res) => {
  try {
    const latest = await Idea.findOne({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select("idea reply createdAt");

    if(!latest) {
      return res.status(404).json({ message: "No feedback found." });
    }

    res.json(latest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const ideas = await Idea.find()
      .sort({ reply: 1, createdAt: -1 })
      .populate("userId", "username email");

    res.json(ideas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reply/:id", protect, adminOnly, async (req, res) => {
  const { reply } = req.body;
  const ideaId = req.params.id;

  try {
    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    idea.reply = reply;
    await idea.save();

    res.json({ message: "Reply saved successfully!" });
  } catch (error) {
    console.error("Error saving reply:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete/:id", protect, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (idea.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Idea.findByIdAndDelete(req.params.id);
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;