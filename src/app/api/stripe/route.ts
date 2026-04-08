import { NextRequest, NextResponse } from 'next/server';
import { setProStatus, findUserByCustomerId } from '@/lib/usage-store';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const PRICE_ID = process.env.STRIPE_PRICE_ID || '';

async function stripeRequest(endpoint: string, body: Record<string, string>) {
  const res = await fetch(`https://api.stripe.com/v1/${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body).toString(),
  });
  return res.json();
}

export const preferredRegion = 'iad1';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'checkout') {
    // Create Stripe Checkout Session
    const body = await request.json();
    const { userId, returnUrl } = body;

    if (!STRIPE_SECRET_KEY || !PRICE_ID) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
    }

    const session = await stripeRequest('checkout/sessions', {
      'mode': 'subscription',
      'line_items[0][price]': PRICE_ID,
      'line_items[0][quantity]': '1',
      'success_url': `${returnUrl || 'http://localhost:3000'}/?upgraded=true`,
      'cancel_url': `${returnUrl || 'http://localhost:3000'}/pro?cancelled=true`,
      'metadata[userId]': userId,
      'subscription_data[metadata][userId]': userId,
    });

    if (session.error) {
      return NextResponse.json({ error: session.error.message }, { status: 400 });
    }

    // Store the customer ID mapping
    if (session.customer) {
      setProStatus(userId, false, session.customer);
    }

    return NextResponse.json({ url: session.url });
  }

  if (action === 'webhook') {
    // Handle Stripe webhooks
    const payload = await request.text();
    // In production, verify stripe-signature header against STRIPE_WEBHOOK_SECRET
    const event = JSON.parse(payload);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        if (userId) {
          setProStatus(userId, true, session.customer, session.subscription);
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const userId = findUserByCustomerId(customerId);
        if (userId) {
          const isActive = subscription.status === 'active' || subscription.status === 'trialing';
          setProStatus(userId, isActive, customerId, subscription.id);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  }

  // Check pro status
  if (action === 'status') {
    const body = await request.json();
    const { userId } = body;
    const { canCreateSession } = await import('@/lib/usage-store');
    const status = canCreateSession(userId);
    return NextResponse.json(status);
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
