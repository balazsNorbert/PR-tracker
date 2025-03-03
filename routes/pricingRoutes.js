const express = require("express");
const router = express.Router();
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  try {
    const clientURL = process.env.CLIENT_URL;
    let { customerId, email, name} = req.body;
    if (!customerId) {
      const existingCustomers = await stripe.customers.list({ email, limit: 1 });
      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email,
          name
        });
        customerId = customer.id;
      }
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: 'price_1QxS12DsK47a6W2mSg4hYCZT',
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14,
      },
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

router.get('/check-subscription', async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const subscriptionId = session.subscription;

    if (!subscriptionId) {
      return res.json({ isTrial: true });
    }
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    res.json({ isTrial: subscription.trial_end > Math.floor(Date.now() / 1000) });
  } catch (error) {
    console.error("Error checking subscription: ", error);
    res.status(500).json({ message: "Error checking subscription", error });
  }
});

module.exports = router;
