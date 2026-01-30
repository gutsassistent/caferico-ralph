const BASE_URL = process.env.WOOCOMMERCE_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

interface WooCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    address_1: string;
    city: string;
    postcode: string;
    country: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    city: string;
    postcode: string;
    country: string;
  };
}

async function wcCustomerFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (!BASE_URL || !CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error('WooCommerce environment variables not configured');
  }

  const url = new URL(`/wp-json/wc/v3/${endpoint}`, BASE_URL);
  url.searchParams.set('consumer_key', CONSUMER_KEY);
  url.searchParams.set('consumer_secret', CONSUMER_SECRET);

  const res = await fetch(url.toString(), {
    cache: 'no-store',
    ...options,
  });

  if (!res.ok) {
    throw new Error(`WooCommerce API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function getCustomerByEmail(email: string): Promise<WooCustomer | null> {
  const customers = await wcCustomerFetch<WooCustomer[]>(
    `customers?email=${encodeURIComponent(email)}`
  );
  return customers[0] ?? null;
}

export async function createCustomer({
  email,
  firstName,
  lastName,
}: {
  email: string;
  firstName?: string;
  lastName?: string;
}): Promise<WooCustomer> {
  return wcCustomerFetch<WooCustomer>('customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      first_name: firstName ?? '',
      last_name: lastName ?? '',
    }),
  });
}

export async function getOrCreateCustomer(
  email: string,
  name?: string
): Promise<WooCustomer> {
  const existing = await getCustomerByEmail(email);
  if (existing) return existing;

  const [firstName, ...rest] = (name ?? '').split(' ');
  const lastName = rest.join(' ');

  return createCustomer({ email, firstName, lastName });
}

export type { WooCustomer };
