export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCustomerByEmail, updateCustomer } from '@/lib/woocommerce-customers';

export async function PUT(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const customer = await getCustomerByEmail(session.user.email);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const body = await request.json();
    const { billing, shipping } = body;

    const updated = await updateCustomer(customer.id, {
      ...(billing && { billing }),
      ...(shipping && { shipping }),
    });

    return NextResponse.json({ customer: updated });
  } catch {
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}
