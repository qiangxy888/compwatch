import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-03-25.dahlia' });
  }
  return stripeInstance;
}

// Price IDs — set these in .env or hardcode after creating in Stripe Dashboard
export const PRICE_IDS = {
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
  pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY || '',
  business_monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || '',
  business_yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY || '',
};

export const PLAN_FROM_PRICE: Record<string, string> = {};
// Build reverse lookup at runtime
if (PRICE_IDS.pro_monthly) PLAN_FROM_PRICE[PRICE_IDS.pro_monthly] = 'pro';
if (PRICE_IDS.pro_yearly) PLAN_FROM_PRICE[PRICE_IDS.pro_yearly] = 'pro';
if (PRICE_IDS.business_monthly) PLAN_FROM_PRICE[PRICE_IDS.business_monthly] = 'business';
if (PRICE_IDS.business_yearly) PLAN_FROM_PRICE[PRICE_IDS.business_yearly] = 'business';
