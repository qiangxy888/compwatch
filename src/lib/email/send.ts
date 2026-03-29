import { Resend } from 'resend';

const FROM_EMAIL = 'CompWatch <notifications@compwatch.ai>';

let resend: Resend | null = null;

function getResend() {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY not configured');
    resend = new Resend(key);
  }
  return resend;
}

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const result = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    return { success: true, id: result.data?.id };
  } catch (err: any) {
    console.error('Email send failed:', err.message);
    return { success: false, error: err.message };
  }
}
