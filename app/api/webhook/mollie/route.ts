import { NextRequest, NextResponse } from 'next/server';
import getMollieClient from '@/lib/mollie';
import { createOrder } from '@/lib/woocommerce-orders';
import { getMolliePayment, insertMolliePayment } from '@/lib/mollie-idempotency';

export async function POST(request: NextRequest) {
  try {
    // Verify webhook token (shared secret appended as ?token=... to webhookUrl)
    const webhookToken = process.env.MOLLIE_WEBHOOK_TOKEN;
    if (webhookToken) {
      const url = new URL(request.url);
      const token = url.searchParams.get('token');
      if (token !== webhookToken) {
        // Return 200 so Mollie doesn't retry, but do nothing
        return new NextResponse('OK', { status: 200 });
      }
    }

    // Mollie sends webhook as application/x-www-form-urlencoded with id=tr_xxx
    const formData = await request.formData();
    const paymentId = formData.get('id');

    if (!paymentId || typeof paymentId !== 'string') {
      // Return 200 even on error — Mollie requires 200 to stop retrying
      return new NextResponse('OK', { status: 200 });
    }

    // Idempotency: skip if already processed (persisted in DB)
    const existing = await getMolliePayment(paymentId);
    if (existing?.processed) {
      return new NextResponse('OK', { status: 200 });
    }

    // Always verify payment status via Mollie API (never trust webhook body)
    const payment = await getMollieClient().payments.get(paymentId);

    if (payment.status !== 'paid') {
      // Not paid — nothing to do, but acknowledge the webhook
      return new NextResponse('OK', { status: 200 });
    }

    // Attempt to claim this payment via DB insert (prevents race conditions)
    const inserted = await insertMolliePayment(paymentId, payment.status);
    if (!inserted) {
      // Another request already processed it
      return new NextResponse('OK', { status: 200 });
    }

    // Extract metadata stored during payment creation
    const metadata = payment.metadata as {
      items?: string;
      customer?: string;
      locale?: string;
      wcCustomerId?: string;
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
        wcCustomerId: metadata.wcCustomerId ? Number(metadata.wcCustomerId) : undefined,
      });

      console.log(`WooCommerce order created: #${order.number} for payment ${paymentId}`);
    } catch (orderError) {
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
