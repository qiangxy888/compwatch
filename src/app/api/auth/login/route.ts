import { NextResponse } from 'next/server';
import { createMagicLink } from '@/lib/auth';
import { sendEmail } from '@/lib/email/send';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  // Rate limit: 5 login attempts per minute per IP
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`login:${ip}`, 5);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 });
  }

  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const token = createMagicLink(cleanEmail);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${appUrl}/api/auth/verify?token=${token}`;

    const hasResend = !!process.env.RESEND_API_KEY;
    if (hasResend) {
      await sendEmail(cleanEmail, '🔑 Sign in to CompWatch', `
        <div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:24px;">
          <h2 style="color:#4F46E5;">Sign in to CompWatch</h2>
          <p>Click the button below to sign in. This link expires in 15 minutes.</p>
          <a href="${verifyUrl}" style="display:inline-block;background:#4F46E5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Sign In →</a>
          <p style="color:#999;font-size:12px;margin-top:24px;">If you didn't request this, ignore this email.</p>
        </div>
      `);
    }

    return NextResponse.json({
      message: hasResend
        ? 'Check your email for the sign-in link!'
        : 'Email not configured. Dev mode link:',
      ...(hasResend ? {} : { devLink: verifyUrl }),
    });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
