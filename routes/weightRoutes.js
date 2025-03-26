const express = require("express");
const router = express.Router();
const Weight = require("../models/Weight");

router.post("/add", async (req, res) => {
    try {
        const { userId, weight, unit } = req.body;
        console.log("userId: ", userId);
        console.log("weight: ", weight);
        console.log("unit: ", unit);

        if (!userId || !weight || !unit) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const newWeight = new Weight({ userId, weight, unit });
        console.log("new weight: ", newWeight);
        await newWeight.save();

        res.status(201).json({ message: "Weight added successfully", newWeight });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const weights = await Weight.find({ userId }).sort({ date: "asc" });

        res.status(200).json(weights);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
