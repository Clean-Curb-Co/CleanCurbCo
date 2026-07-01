import "server-only";

import Stripe from "stripe";
import { getStripeEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (stripeClient) return stripeClient;

  const { secretKey } = getStripeEnv();
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  stripeClient = new Stripe(secretKey);
  return stripeClient;
}
