import { eq } from 'drizzle-orm';
import { getDb } from './db';
import { molliePayments } from './schema';

/** Returns the existing row if the paymentId was already recorded, or null. */
export async function getMolliePayment(paymentId: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(molliePayments)
    .where(eq(molliePayments.paymentId, paymentId))
    .limit(1);
  return rows[0] ?? null;
}

/** Insert a new payment record. Returns true on success, false if it already exists (conflict). */
export async function insertMolliePayment(
  paymentId: string,
  status: string
): Promise<boolean> {
  const db = getDb();
  const result = await db
    .insert(molliePayments)
    .values({ paymentId, status, processed: true })
    .onConflictDoNothing({ target: molliePayments.paymentId });
  // postgres-js returns an array; length 0 means conflict (row already existed)
  return (result as unknown as unknown[]).length > 0;
}
