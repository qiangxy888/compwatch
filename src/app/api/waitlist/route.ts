import { NextResponse } from 'next/server';
import { addToWaitlist } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`waitlist:${ip}`, 10);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { email, source } = await request.json();

    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const result = addToWaitlist(email.toLowerCase().trim(), source);

    if (!result.success) {
      return NextResponse.json({ message: "You're already on the list!" }, { status: 200 });
    }

    return NextResponse.json({ message: 'Welcome! We\'ll notify you when CompWatch launches.' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
