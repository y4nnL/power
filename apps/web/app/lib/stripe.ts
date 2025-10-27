import Stripe from "stripe";

declare global {
  // eslint-disable-next-line no-var
  var stripe: Stripe | undefined;
}

export const stripe = global.stripe ??
  new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2024-06-20",
    appInfo: {
      name: "Power",
      version: "0.1.0"
    }
  });

if (process.env.NODE_ENV !== "production") {
  global.stripe = stripe;
}
