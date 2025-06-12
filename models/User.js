const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  streak: { type: Number, default: 0 },
  weeklyGoal: { type: Number, default: 3 },
  lastUpdatedStreakDate: { type: Date, default: null},
  isAdmin: { type: Boolean, default: false }
});

userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);