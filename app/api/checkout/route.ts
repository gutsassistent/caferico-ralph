import { NextRequest, NextResponse } from 'next/server';
import mollieClient from '@/lib/mollie';
import { getProducts } from '@/lib/woocommerce';
import type { WooCommerceProduct } from '@/types/woocommerce';
import mockProducts from '@/data/mock-products.json';

type CheckoutItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  grind: string | null;
  weight: string | null;
};

type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
};

type CheckoutBody = {
  items: CheckoutItem[];
  customer: CheckoutCustomer;
  locale?: string;
};

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
}

function validateCustomer(customer: CheckoutCustomer): string | null {
  const required: (keyof CheckoutCustomer)[] = [
    'firstName', 'lastName', 'email', 'street', 'postalCode', 'city', 'country',
  ];
  for (const field of required) {
    if (!customer[field] || typeof customer[field] !== 'string' || !customer[field].trim()) {
      return `Missing required field: ${field}`;
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    return 'Invalid email address';
  }
  return null;
}

function validateItems(items: CheckoutItem[]): string | null {
  if (!Array.isArray(items) || items.length === 0) {
    return 'Cart is empty';
  }
  for (const item of items) {
    if (!item.id || !item.name || typeof item.quantity !== 'number' || item.quantity < 1) {
      return 'Invalid cart item';
    }
  }
  return null;
}

async function getVerifiedPrices(items: CheckoutItem[]): Promise<Map<string, number>> {
  const priceMap = new Map<string, number>();

  // Try WooCommerce first
  try {
    const products = await getProducts();
    for (const p of products) {
      const price = parseFloat(p.sale_price || p.price || p.regular_price);
      if (!isNaN(price)) {
        priceMap.set(String(p.id), price);
        priceMap.set(p.slug, price);
      }
    }
  } catch {
    // Fall back to mock data
  }

  // Fill in from mock data if needed
  for (const item of items) {
    if (!priceMap.has(item.id) && !priceMap.has(item.slug)) {
      const mock = (mockProducts as unknown as WooCommerceProduct[]).find(
        (p) => String(p.id) === item.id || p.slug === item.slug
      );
      if (mock) {
        const price = typeof mock.price === 'number'
          ? mock.price
          : parseFloat(mock.sale_price || mock.price || mock.regular_price);
        if (!isNaN(price)) {
          priceMap.set(String(mock.id), price);
          priceMap.set(mock.slug, price);
        }
      }
    }
  }

  return priceMap;
}

function calculateTotal(items: CheckoutItem[], priceMap: Map<string, number>): number {
  let total = 0;
  for (const item of items) {
    const price = priceMap.get(item.id) ?? priceMap.get(item.slug);
    if (price === undefined) {
      throw new Error(`Price not found for product: ${item.name} (${item.id})`);
    }
    total += price * item.quantity;
  }
  return Math.round(total * 100) / 100;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const { items, customer, locale = 'nl' } = body;

    // Validate input
    const customerError = validateCustomer(customer);
    if (customerError) {
      return NextResponse.json({ error: customerError }, { status: 400 });
    }

    const itemsError = validateItems(items);
    if (itemsError) {
      return NextResponse.json({ error: itemsError }, { status: 400 });
    }

    // Server-side price verification
    const priceMap = await getVerifiedPrices(items);
    const total = calculateTotal(items, priceMap);

    if (total <= 0) {
      return NextResponse.json({ error: 'Invalid order total' }, { status: 400 });
    }

    const baseUrl = getBaseUrl();
    const description = `Café RICO — ${items.length} ${items.length === 1 ? 'product' : 'producten'}`;

    // Create Mollie payment
    const payment = await mollieClient.payments.create({
      amount: {
        currency: 'EUR',
        value: total.toFixed(2),
      },
      description,
      redirectUrl: `${baseUrl}/${locale}/checkout/return?id={id}`,
      webhookUrl: `${baseUrl}/api/webhook/mollie`,
      metadata: {
        items: JSON.stringify(items),
        customer: JSON.stringify(customer),
        locale,
      },
    });

    const checkoutUrl = payment.getCheckoutUrl();

    if (!checkoutUrl) {
      return NextResponse.json(
        { error: 'Failed to get Mollie checkout URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl, paymentId: payment.id });
  } catch (error) {
    console.error('Checkout error:', error);

    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
