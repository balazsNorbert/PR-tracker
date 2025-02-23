const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const User = require("../models/User");

router.get('/:userId/streak', protect, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if(!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ streak: user.streak, weeklyGoal: user.weeklyGoal });
  } catch (error) {
    console.error('Error fetching streak:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:userId/weekly-goal', async (req, res) => {
  try {
    const { userId } = req.params;
    const { weeklyGoal, completedWorkoutsThisWeek } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    console.log("Last date: ", user.lastUpdatedGoalDate);

    let streakUpdated = false;
    if (weeklyGoal > user.weeklyGoal && completedWorkoutsThisWeek < weeklyGoal) {
      user.streak = Math.max(user.streak - 1, 0);
      const lastWeekDate = new Date(startOfWeek);
      lastWeekDate.setDate(startOfWeek.getDate() - 7);
      user.lastUpdatedStreakDate = lastWeekDate;
    }

    if (!user.lastUpdatedStreakDate || new Date(user.lastUpdatedStreakDate) < startOfWeek) {
      if (completedWorkoutsThisWeek >= weeklyGoal) {
        user.streak += 1;
        user.lastUpdatedStreakDate = new Date();
        streakUpdated = true;
      }
    }
    user.weeklyGoal = weeklyGoal;
    await user.save();
    res.json({
      message: 'Weekly goal and streak updated successfully', weeklyGoal: user.weeklyGoal,
      streak: user.streak, streakUpdated: streakUpdated
    });
  } catch (error) {
    console.error('Error updating weekly goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;