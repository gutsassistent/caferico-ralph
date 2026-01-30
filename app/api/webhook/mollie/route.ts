import { NextRequest, NextResponse } from 'next/server';
import getMollieClient from '@/lib/mollie';
import { createOrder } from '@/lib/woocommerce-orders';

// Track processed payments to prevent duplicate orders
const globalWithProcessed = globalThis as typeof globalThis & {
  __processedPayments?: Set<string>;
};
if (!globalWithProcessed.__processedPayments) {
  globalWithProcessed.__processedPayments = new Set();
}
const processedPayments = globalWithProcessed.__processedPayments;

export async function POST(request: NextRequest) {
  try {
    // Mollie sends webhook as application/x-www-form-urlencoded with id=tr_xxx
    const formData = await request.formData();
    const paymentId = formData.get('id');

    if (!paymentId || typeof paymentId !== 'string') {
      // Return 200 even on error — Mollie requires 200 to stop retrying
      return new NextResponse('OK', { status: 200 });
    }

    // Idempotency: skip if already processed
    if (processedPayments.has(paymentId)) {
      return new NextResponse('OK', { status: 200 });
    }

    // Always verify payment status via Mollie API (never trust webhook body)
    const payment = await getMollieClient().payments.get(paymentId);

    if (payment.status !== 'paid') {
      // Not paid — nothing to do, but acknowledge the webhook
      return new NextResponse('OK', { status: 200 });
    }

    // Mark as processed before creating order (prevent race conditions)
    processedPayments.add(paymentId);

    // Extract metadata stored during payment creation
    const metadata = payment.metadata as {
      items?: string;
      customer?: string;
      locale?: string;
    } | null;

    if (!metadata?.items || !metadata?.customer) {
      console.error(`Mollie webhook: missing metadata for payment ${paymentId}`);
      return new NextResponse('OK', { status: 200 });
    }

    const items = JSON.parse(metadata.items);
    const customer = JSON.parse(metadata.customer);

    // Create WooCommerce order
    try {
      const order = await createOrder({
        customer,
        items,
        molliePaymentId: paymentId,
        total: payment.amount.value,
      });

      console.log(`WooCommerce order created: #${order.number} for payment ${paymentId}`);
    } catch (orderError) {
      // Remove from processed so it can be retried
      processedPayments.delete(paymentId);
      console.error(`Failed to create WooCommerce order for payment ${paymentId}:`, orderError);
      // Return 500 so Mollie retries the webhook
      return new NextResponse('Error', { status: 500 });
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Mollie webhook error:', error);
    // Return 500 so Mollie retries
    return new NextResponse('Error', { status: 500 });
  }
}
