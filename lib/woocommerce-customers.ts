import { wcFetch } from './wc-client';

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

export async function getCustomerByEmail(email: string): Promise<WooCustomer | null> {
  const customers = await wcFetch<WooCustomer[]>('customers', {
    email: email,
  });
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
  return wcFetch<WooCustomer>('customers', {}, {
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
