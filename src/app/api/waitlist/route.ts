import { NextResponse } from 'next/server';
import { addToWaitlist } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const result = addToWaitlist(email.toLowerCase().trim(), source);

    if (!result.success) {
      return NextResponse.json({ message: "You're already on the list!" }, { status: 200 });
    }

    return NextResponse.json({ message: 'Welcome! We\'ll notify you when CompWatch launches.' }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
