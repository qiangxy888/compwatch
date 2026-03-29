import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getStripe, PRICE_IDS } from '@/lib/stripe';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: 'Payments not configured' }, { status: 503 });

  const { plan, interval } = await request.json();
  const priceId = interval === 'yearly'
    ? (plan === 'business' ? PRICE_IDS.business_yearly : PRICE_IDS.pro_yearly)
    : (plan === 'business' ? PRICE_IDS.business_monthly : PRICE_IDS.pro_monthly);

  if (!priceId) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Reuse or create Stripe customer
  let customerId = session.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: session.email, metadata: { userId: session.user_id } });
    customerId = customer.id;
    getDb().prepare('UPDATE users SET stripe_customer_id = ? WHERE id = ?').run(customerId, session.user_id);
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/pricing`,
    metadata: { userId: session.user_id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
