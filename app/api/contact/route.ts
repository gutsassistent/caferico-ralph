import { NextRequest } from 'next/server';
import { Resend } from 'resend';

const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || 'info@caferico.be';

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

// Simple in-memory rate limiting: max 3 per IP per hour
const rateMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const timestamps = (rateMap.get(ip) || []).filter((t) => now - t < hour);
  if (timestamps.length >= 3) return true;
  timestamps.push(now);
  rateMap.set(ip, timestamps);
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  if (isRateLimited(ip)) {
    return Response.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, email, subject, message } = body as {
    name: string;
    email: string;
    subject: string;
    message: string;
  };

  // Validation
  if (
    !name?.trim() ||
    !email?.trim() ||
    !subject?.trim() ||
    !message?.trim()
  ) {
    return Response.json(
      { error: 'All fields are required: name, email, subject, message.' },
      { status: 400 },
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  try {
    await getResend().emails.send({
      from: `Caférico <noreply@caferico.be>`,
      to: CONTACT_EMAIL_TO,
      replyTo: email,
      subject: `Contact: ${subject}`,
      text: `Van: ${name} (${email})\n\n${message}`,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Failed to send contact email:', error);
    return Response.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 },
    );
  }
}
