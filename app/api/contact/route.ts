import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// Simple in-memory rate limiting: max 3 per IP per hour
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 3;

  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < windowMs);
  rateLimitMap.set(ip, recent);

  if (recent.length >= maxRequests) {
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'rate_limit' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const { name, email, subject, message } = body as {
    name: string;
    email: string;
    subject: string;
    message: string;
  };

  // Server-side validation
  if (
    !name || typeof name !== 'string' || !name.trim() ||
    !email || typeof email !== 'string' || !emailPattern.test(email) ||
    !subject || typeof subject !== 'string' || !subject.trim() ||
    !message || typeof message !== 'string' || !message.trim()
  ) {
    return NextResponse.json({ error: 'validation' }, { status: 400 });
  }

  try {
    await getResend().emails.send({
      from: 'Caférico <noreply@caferico.be>',
      to: 'info@caferico.be',
      replyTo: email,
      subject: `Contact: ${subject.trim()}`,
      text: `Van: ${name.trim()} (${email})\n\n${message.trim()}`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'send_failed' },
      { status: 500 }
    );
  }
}
