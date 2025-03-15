const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET);

router.post("/subscribe", async (req, res) => {
  try {
    const { email, plan } = req.body;

    if (!email || !plan) {
      return res.status(400).json({ error: "Email and plan are required" });
    }

    // Create a new customer in Stripe
    const customer = await stripe.customers.create({ email });

    // Select price ID based on plan
    const priceId = plan === "Basic" ? "price_12345" : "price_67890";

    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
    });

    res.json({ success: true, subscriptionId: subscription.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
