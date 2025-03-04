const express = require("express");
const router = express.Router();
const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  try {
    const clientURL = process.env.CLIENT_URL;
    let { customerId } = req.body;
    let trialPeriod = 14;

    if (!customerId) {
      return res.status(400).send("Customer ID is missing.");
    }

    const customer = await stripe.customers.retrieve(customerId);
    if(!customer) {
      return res.status(404).send("Customer not found");
    }

    const {email, name} = customer;
    let stripeCustomerId = customerId;
    if (!stripeCustomerId) {
        const newCustomer = await stripe.customers.create({
          email,
          name,
        });
        stripeCustomerId = newCustomer.id;
    } else {
      const customer = await stripe.customers.retrieve(stripeCustomerId);
      console.log("Customer: ", customer);
      const subscriptions = await stripe.subscriptions.list({
        customer: stripeCustomerId,
        status: 'all',
        limit: 100
      });
      console.log("Subscriptions: ", subscriptions);
      console.log("Subscriptions data: ", subscriptions.data);

      const hasUsedTrial = subscriptions.data.some(sub => sub.status === 'canceled');
      if (hasUsedTrial) {
        console.log("User has already used a trial or canceled before, no trial.");
        trialPeriod = undefined;
      } else {
        console.log("No previous trial or subscription, offering trial.");
        trialPeriod = 14;
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: stripeCustomerId,
      line_items: [
        {
          price: 'price_1QxS12DsK47a6W2mSg4hYCZT',
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: trialPeriod,
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
