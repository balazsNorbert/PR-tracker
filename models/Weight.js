const mongoose = require("mongoose");

const weightSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true },
    weight: { type: Number, required: true },
    unit: { type: String, enum: ["kg", "lbs"], default: "kg" },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Weight", weightSchema);