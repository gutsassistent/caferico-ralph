export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCustomerByEmail } from '@/lib/woocommerce-customers';

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const customer = await getCustomerByEmail(session.user.email);

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
