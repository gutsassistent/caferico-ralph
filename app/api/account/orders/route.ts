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
    const url = new URL('/wp-json/wc/v3/orders', BASE_URL);
    url.searchParams.set('consumer_key', CONSUMER_KEY);
    url.searchParams.set('consumer_secret', CONSUMER_SECRET);
    url.searchParams.set('search', session.user.email);
    url.searchParams.set('per_page', '20');
    url.searchParams.set('orderby', 'date');
    url.searchParams.set('order', 'desc');

    const res = await fetch(url.toString(), { cache: 'no-store' });

    if (!res.ok) {
      return NextResponse.json({ error: 'WooCommerce API error' }, { status: 500 });
    }

    const orders = await res.json();

    const mapped = orders.map((order: {
      id: number;
      number: string;
      status: string;
      date_created: string;
      total: string;
      currency: string;
      line_items: { name: string; quantity: number; total: string }[];
    }) => ({
      id: order.id,
      number: order.number,
      status: order.status,
      date: order.date_created,
      total: order.total,
      currency: order.currency,
      itemCount: order.line_items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0),
      items: order.line_items.map((item: { name: string; quantity: number; total: string }) => ({
        name: item.name,
        quantity: item.quantity,
        total: item.total,
      })),
    }));

    return NextResponse.json({ orders: mapped });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
