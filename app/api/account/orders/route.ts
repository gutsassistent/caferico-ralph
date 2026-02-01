export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getOrdersByEmail } from '@/lib/woocommerce-orders';

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const orders = await getOrdersByEmail(session.user.email);

    const mapped = orders.map((order) => ({
      id: order.id,
      number: order.number,
      status: order.status,
      date: order.date_created,
      total: order.total,
      currency: order.currency,
      itemCount: order.line_items.reduce((sum, item) => sum + item.quantity, 0),
      items: order.line_items.map((item) => ({
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
