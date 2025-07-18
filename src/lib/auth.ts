import { db } from "@/db/drizzle";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { stripe } from "@better-auth/stripe";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql"
    usePlural: true,
    schema,
  }),
  rateLimit: {
    window: 10,
    max: 100,
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      /*       redirectURI: process.env.BASE_URL + "/auth/callback/google",
       */
    },
  },

  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "starter_yearly",
            priceId: "price_1Rl8igPqVRKTRl16U4TR2c3W",
          },
          {
            name: "starter_monthly",
            priceId: "price_1Rl8fCPqVRKTRl16oTAGo7L4",
          },
        ],
      },
    }),
    nextCookies(),
  ], // make sure this is the last plugin in the array
});
