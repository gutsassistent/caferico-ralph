import { NextRequest } from 'next/server';
import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory rate limiting: max 3 per IP per hour
const rateMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const timestamps = (rateMap.get(ip) || []).filter((t) => now - t < hour);
  rateMap.set(ip, timestamps);
  if (timestamps.length >= 3) return true;
  timestamps.push(now);
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (isRateLimited(ip)) {
    return Response.json(
      { ok: false, error: 'rate_limited' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const { email } = body as { email: string };

  if (!email?.trim()) {
    return Response.json(
      { ok: false, error: 'missing_email' },
      { status: 400 }
    );
  }

  if (!emailPattern.test(email)) {
    return Response.json(
      { ok: false, error: 'invalid_email' },
      { status: 400 }
    );
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    return Response.json(
      { ok: false, error: 'server_config' },
      { status: 500 }
    );
  }

  try {
    const resend = getResend();
    const { error } = await resend.contacts.create({
      email,
      audienceId,
    });

    if (error) {
      // Resend returns an error when the contact already exists
      if (
        error.message?.toLowerCase().includes('already') ||
        error.message?.toLowerCase().includes('exists')
      ) {
        return Response.json({ ok: true, duplicate: true });
      }
      return Response.json(
        { ok: false, error: 'subscribe_failed' },
        { status: 500 }
      );
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { ok: false, error: 'subscribe_failed' },
      { status: 500 }
    );
  }
}
