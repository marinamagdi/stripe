// index.js
const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
  const { priceIds, successUrl, cancelUrl } = req.body;
  console.log(priceIds, successUrl, cancelUrl);
  try {
    const line_items = priceIds.map((price) => ({
      price,
      quantity: 1,
    }));
    console.log(line_items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    console.log("Stripe session created:", session);

    res.json({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Stripe server is running ✅");
});

app.listen(3000, () => console.log("Server running on port 3000"));
