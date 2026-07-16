// DEPRECATED: This file is deprecated and will be removed in a future version.
// Please use email.service.ts with AWS SES instead.
// This file is kept for backward compatibility during migration.

import { sendEmail } from './email.service.js';

/**
 * @deprecated Use sendEmail() from email.service.ts instead
 */
export async function sendMail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  console.warn('⚠️  sendMail() from mailer.ts is deprecated. Use sendEmail() from email.service.ts');
  await sendEmail({ to, subject, text, html });
}