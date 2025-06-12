const express = require("express");
const router = express.Router();
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  try {
    const clientURL = process.env.REACT_APP_CLIENT_URL;
    const priceID = process.env.REACT_APP_STRIPE_PRICE_ID;
    let { customerId } = req.body;

    if (!customerId) {
      return res.status(400).send("Customer ID is missing.");
    }

    const customer = await stripe.customers.retrieve(customerId);
    if(!customer) {
      return res.status(404).send("Customer not found");
    }

    let stripeCustomerId = customerId;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${clientURL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientURL}/cancel`,
    });
    res.json({ id: session.id, customerId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error in creating Stripe Checkout session');
  }
});

router.post('/cancel-subscription', async (req, res) => {
  try {
    const { stripeCustomerId } = req.body;
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 1
    });

    if (!subscriptions.data.length) {
      return res.status(400).json({ message: "No active subscription found." });
    }

    const subscription = subscriptions.data[0];

    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
      return res.status(400).json({ message: "No active subscription to cancel." });
    }

    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true
    });

    res.json({ message: "Subscription cancellation scheduled. You can resubscribe at any time after cancellation.",
      cancel_at: subscription.current_perriod_end
     });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).json({ message: "Error canceling subscription", error });
  }
});

module.exports = router;
