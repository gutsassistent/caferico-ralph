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

  const { name, email, subject, message } = body as {
    name: string;
    email: string;
    subject: string;
    message: string;
  };

  // Server-side validation
  if (
    !name?.trim() ||
    !email?.trim() ||
    !subject?.trim() ||
    !message?.trim()
  ) {
    return Response.json(
      { ok: false, error: 'missing_fields' },
      { status: 400 }
    );
  }

  if (!emailPattern.test(email)) {
    return Response.json(
      { ok: false, error: 'invalid_email' },
      { status: 400 }
    );
  }

  try {
    await getResend().emails.send({
      from: 'Caférico <noreply@caferico.be>',
      to: 'info@caferico.be',
      replyTo: email,
      subject: `Contact: ${subject}`,
      text: `Van: ${name} (${email})\n\n${message}`,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { ok: false, error: 'send_failed' },
      { status: 500 }
    );
  }
}
