const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const checkout = async (req, res) => {
  try {
    const storeItems = new Map([
      [1, { priceInCents: 10000, name: "Learn NodeJS" }],
      [2, { priceInCents: 20000, name: "Learn HTML" }],
    ]);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: process.env.APP_BASE_PATH,
      cancel_url: process.env.APP_BASE_PATH,
    });

    return {
      error: 0,
      message: "CheckOut link generated successfully",
      data: session.url,
    };
  } catch (error) {
    return { error: 1, message: error.message };
  }
};

module.exports = {
  checkout,
};
