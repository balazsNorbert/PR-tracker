const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    if (existingUser.email === email) {
      return res.status(400).json({ message: "Email already exists!" });
    }
    if (existingUser.username === username) {
      return res.status(400).json({ message: "Username already exists!" });
    }
  }
  const customer = await stripe.customers.create({
    email: email,
    name: username,
  });

  const trialSubscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: process.env.REACT_APP_STRIPE_PRICE_ID }],
    trial_period_days: 14,
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });

  const user = new User({
    username,
    password,
    email,
    stripeCustomerId: customer.id,
    stripeSubscriptionId: trialSubscription.id,
  });

  try {
    const createdUser = await user.save();
    res.status(201).json({ message: "User registered successfully", user: createdUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

router.post("/login", async(req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password!" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password!" });
    }

    let isSubscribed = false;
    if (user.stripeCustomerId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripeCustomerId
      });
      if (subscriptions.data.length > 0) {
        const sub = subscriptions.data[0];
        if (sub.status === 'active' || sub.status === 'trialing') {
          isSubscribed = true;
        }
      }
    }

    const token = jwt.sign({ userId: user._id, username: user.username, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ message: "Login successful", token, isSubscribed, customerId: user.stripeCustomerId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;