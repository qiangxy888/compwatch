import { NextResponse } from 'next/server';
import { getStripe, PLAN_FROM_PRICE } from '@/lib/stripe';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      if (userId && session.subscription) {
        // Get subscription to determine plan
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = sub.items.data[0]?.price?.id || '';
        const plan = PLAN_FROM_PRICE[priceId] || 'pro';

        getDb().prepare('UPDATE users SET plan = ?, stripe_customer_id = ?, stripe_subscription_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
          .run(plan, session.customer, session.subscription, userId);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as any;
      const priceId = sub.items?.data?.[0]?.price?.id || '';
      const plan = PLAN_FROM_PRICE[priceId] || 'pro';
      const status = sub.status;

      if (status === 'active') {
        getDb().prepare('UPDATE users SET plan = ?, updated_at = CURRENT_TIMESTAMP WHERE stripe_subscription_id = ?')
          .run(plan, sub.id);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as any;
      getDb().prepare('UPDATE users SET plan = ?, stripe_subscription_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE stripe_subscription_id = ?')
        .run('free', sub.id);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as any;
      console.warn('Payment failed for customer:', invoice.customer);
      // Could send a dunning email here
      break;
    }
  }

  return NextResponse.json({ received: true });
}
