import { NextRequest, NextResponse } from 'next/server';
import mollieClient from '@/lib/mollie';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id || !/^tr_[a-zA-Z0-9]+$/.test(id)) {
      return NextResponse.json(
        { error: 'Invalid payment ID' },
        { status: 400 }
      );
    }

    const payment = await mollieClient.payments.get(id);

    const statusMap: Record<string, string> = {
      paid: 'paid',
      authorized: 'paid',
      pending: 'pending',
      open: 'pending',
      failed: 'failed',
      canceled: 'canceled',
      expired: 'expired',
    };

    const status = statusMap[payment.status] || 'failed';

    return NextResponse.json({
      status,
      orderId: payment.id,
    });
  } catch (error) {
    console.error('Payment status error:', error);

    const message =
      error instanceof Error ? error.message : 'Failed to fetch payment status';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
