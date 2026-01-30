export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const BASE_URL = process.env.WOOCOMMERCE_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  if (!BASE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    return NextResponse.json({ error: 'WooCommerce not configured' }, { status: 500 });
  }

  try {
    const url = new URL('/wp-json/wc/v3/customers', BASE_URL);
    url.searchParams.set('consumer_key', CONSUMER_KEY);
    url.searchParams.set('consumer_secret', CONSUMER_SECRET);
    url.searchParams.set('email', session.user.email);

    const res = await fetch(url.toString(), { cache: 'no-store' });

    if (!res.ok) {
      return NextResponse.json({ error: 'WooCommerce API error' }, { status: 500 });
    }

    const customers = await res.json();
    const customer = customers[0] ?? null;

    if (!customer) {
      // Return session data as fallback
      return NextResponse.json({
        customer: {
          id: 0,
          first_name: session.user.name?.split(' ')[0] ?? '',
          last_name: session.user.name?.split(' ').slice(1).join(' ') ?? '',
          email: session.user.email,
          billing: {
            first_name: '',
            last_name: '',
            email: session.user.email,
            address_1: '',
            city: '',
            postcode: '',
            country: '',
            phone: '',
          },
          shipping: {
            first_name: '',
            last_name: '',
            address_1: '',
            city: '',
            postcode: '',
            country: '',
          },
        },
      });
    }

    return NextResponse.json({ customer });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch customer data' }, { status: 500 });
  }
}
