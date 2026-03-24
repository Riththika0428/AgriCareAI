import Stripe       from "stripe";
import Subscription from "../models/Subscription.js";
import User         from "../models/User.js";

// ── CREATE CHECKOUT SESSION ────────────────────────────────
export const createCheckoutSession = async (req, res) => {
  try {
    const stripe       = new Stripe(process.env.STRIPE_SECRET_KEY);
    const PLAN_PRICE_ID = process.env.STRIPE_PRICE_ID;

    const farmer = await User.findById(req.user._id);
    if (!farmer) return res.status(404).json({ message: "Farmer not found." });

    let sub        = await Subscription.findOne({ farmer: req.user._id });
    let customerId = sub?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email:    farmer.email,
        name:     farmer.name,
        metadata: { farmerId: farmer._id.toString() },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer:   customerId,
      mode:       "subscription",
      line_items: [{ price: PLAN_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/dashboard/farmer?subscription=success`,
      cancel_url:  `${process.env.FRONTEND_URL}/subscription?cancelled=true`,
      metadata:    { farmerId: req.user._id.toString() },
      subscription_data: {
        metadata:           { farmerId: req.user._id.toString() },
        trial_period_days:  7,
      },
    });

    if (!sub) {
      await Subscription.create({
        farmer:           req.user._id,
        stripeCustomerId: customerId,
        status:           "inactive",
      });
    } else if (!sub.stripeCustomerId) {
      sub.stripeCustomerId = customerId;
      await sub.save();
    }

    // ── After creating session, mark subscription as trialing ──
    // This handles the case where webhooks aren't set up (local dev)
    await Subscription.findOneAndUpdate(
      { farmer: req.user._id },
      {
        stripeCustomerId: customerId,
        status: "trialing",
      },
      { upsert: true, new: true }
    );

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Checkout error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ── GET MY SUBSCRIPTION ────────────────────────────────────
export const getMySubscription = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sub    = await Subscription.findOne({ farmer: req.user._id });
    if (!sub) return res.json({ status: "inactive", isActive: false });

    if (sub.stripeSubscriptionId) {
      const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
      sub.status             = stripeSub.status;
      sub.currentPeriodStart = new Date(stripeSub.current_period_start * 1000);
      sub.currentPeriodEnd   = new Date(stripeSub.current_period_end   * 1000);
      sub.cancelAtPeriodEnd  = stripeSub.cancel_at_period_end;
      await sub.save();
    }

    res.json({
      status:            sub.status,
      isActive:          sub.status === "active" || sub.status === "trialing",
      currentPeriodEnd:  sub.currentPeriodEnd,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      plan:              sub.plan,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── CANCEL SUBSCRIPTION ────────────────────────────────────
export const cancelSubscription = async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sub    = await Subscription.findOne({ farmer: req.user._id });
    if (!sub?.stripeSubscriptionId) return res.status(404).json({ message: "No active subscription." });

    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    sub.cancelAtPeriodEnd = true;
    await sub.save();

    res.json({ message: "Subscription will cancel at end of billing period.", sub });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── STRIPE WEBHOOK ─────────────────────────────────────────
export const handleWebhook = async (req, res) => {
  const sig    = req.headers["stripe-signature"];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event;

  try {
    if (!secret) {
      // Dev mode — no signature verification
      event = JSON.parse(req.body.toString());
      console.log("⚠ Webhook dev mode — no signature verification");
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, secret);
    }
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).json({ message: `Webhook error: ${err.message}` });
  }

  const data = event.data.object;

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const farmerId = data.metadata?.farmerId;
      if (!farmerId) break;
      await Subscription.findOneAndUpdate(
        { farmer: farmerId },
        {
          stripeSubscriptionId: data.id,
          status:               data.status,
          currentPeriodStart:   new Date(data.current_period_start * 1000),
          currentPeriodEnd:     new Date(data.current_period_end   * 1000),
          cancelAtPeriodEnd:    data.cancel_at_period_end,
        },
        { upsert: true }
      );
      console.log(`✅ Subscription ${data.status} for farmer ${farmerId}`);
      break;
    }
    case "customer.subscription.deleted": {
      const farmerId = data.metadata?.farmerId;
      if (!farmerId) break;
      await Subscription.findOneAndUpdate({ farmer: farmerId }, { status: "cancelled" });
      break;
    }
    case "invoice.payment_succeeded": {
      const customerId = data.customer;
      const sub = await Subscription.findOne({ stripeCustomerId: customerId });
      if (sub) { sub.status = "active"; await sub.save(); }
      break;
    }
    case "invoice.payment_failed": {
      const customerId = data.customer;
      const sub = await Subscription.findOne({ stripeCustomerId: customerId });
      if (sub) { sub.status = "past_due"; await sub.save(); }
      break;
    }
  }

  res.json({ received: true });
};

// ── ADMIN GET ALL ──────────────────────────────────────────
export const adminGetAll = async (req, res) => {
  try {
    const subs = await Subscription.find()
      .populate("farmer", "name email")
      .sort("-createdAt");
    res.json({ count: subs.length, subs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};