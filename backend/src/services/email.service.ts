import { env } from '../config/environment.js';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

function escapeHtml(value = ''): string {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

export async function sendWelcomeEmail({ email, name }: { email: string; name: string }): Promise<unknown> {
  const recipientName = escapeHtml(name || email);
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: { accept: 'application/json', 'api-key': env.brevoApiKey!, 'content-type': 'application/json' },
    body: JSON.stringify({
      sender: { email: env.emailFrom, name: env.emailFromName },
      to: [{ email, name: name || email }],
      subject: 'Welcome to Morrow Goods',
      textContent: `Welcome to Morrow Goods, ${name || 'there'}! Your account is ready.`,
      htmlContent: `<p>Welcome to Morrow Goods, ${recipientName}!</p><p>Your account is ready. We're glad you're here.</p>`,
    }),
  });
  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Brevo rejected the welcome email (${response.status}): ${details.slice(0, 500)}`);
  }
  return response.json();
}
