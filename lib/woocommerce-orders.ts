import { wcFetch } from './wc-client';

type OrderLineItem = {
  product_id?: number;
  name: string;
  quantity: number;
  price: string;
  meta_data?: { key: string; value: string }[];
};

type OrderAddress = {
  first_name: string;
  last_name: string;
  email?: string;
  address_1: string;
  city: string;
  postcode: string;
  country: string;
  phone?: string;
};

type CreateOrderPayload = {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
  };
  items: {
    id: string;
    slug: string;
    name: string;
    price: number;
    quantity: number;
    grind: string | null;
    weight: string | null;
  }[];
  molliePaymentId: string;
  total: string;
  wcCustomerId?: number;
};

type WooCommerceOrderResponse = {
  id: number;
  number: string;
  status: string;
  total: string;
};

type WooCommerceOrder = {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  currency: string;
  line_items: { name: string; quantity: number; total: string }[];
};

export async function createOrder(payload: CreateOrderPayload): Promise<WooCommerceOrderResponse> {
  const { customer, items, molliePaymentId, total, wcCustomerId } = payload;

  const billing: OrderAddress = {
    first_name: customer.firstName,
    last_name: customer.lastName,
    email: customer.email,
    address_1: customer.street,
    city: customer.city,
    postcode: customer.postalCode,
    country: customer.country,
    phone: customer.phone || '',
  };

  const lineItems: OrderLineItem[] = items.map((item) => {
    const meta: { key: string; value: string }[] = [];
    if (item.grind) meta.push({ key: 'Maling', value: item.grind });
    if (item.weight) meta.push({ key: 'Gewicht', value: item.weight });

    return {
      product_id: isNaN(Number(item.id)) ? undefined : Number(item.id),
      name: item.name,
      quantity: item.quantity,
      price: item.price.toFixed(2),
      meta_data: meta.length > 0 ? meta : undefined,
    };
  });

  const orderData = {
    status: 'processing',
    ...(wcCustomerId && { customer_id: wcCustomerId }),
    billing,
    shipping: billing,
    line_items: lineItems,
    total,
    payment_method: 'mollie',
    payment_method_title: 'Mollie',
    set_paid: true,
    meta_data: [
      { key: '_mollie_payment_id', value: molliePaymentId },
    ],
  };

  return wcFetch<WooCommerceOrderResponse>('orders', {}, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
}

export async function getOrdersByEmail(email: string): Promise<WooCommerceOrder[]> {
  return wcFetch<WooCommerceOrder[]>('orders', {
    search: email,
    per_page: '20',
    orderby: 'date',
    order: 'desc',
  });
}
