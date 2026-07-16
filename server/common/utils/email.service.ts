import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { env } from '../../config/env';

// Initialize SES client
const sesClient = new SESClient({
  region: env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY || '',
  },
});

interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Generic email sending function using AWS SES
 * @param params - Email parameters (to, subject, text, html)
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail({ to, subject, text, html }: EmailParams): Promise<void> {
  if (!env.SES_FROM_EMAIL) {
    console.warn('SES_FROM_EMAIL not configured — skipping email to', to);
    return;
  }

  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
    console.warn('AWS credentials not configured — skipping email to', to);
    return;
  }

  try {
    console.log('📨 Sending email via SES to:', to);
    console.log('📧 Subject:', subject);

    const command = new SendEmailCommand({
      Source: env.SES_FROM_EMAIL,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: text,
            Charset: 'UTF-8',
          },
          ...(html && {
            Html: {
              Data: html,
              Charset: 'UTF-8',
            },
          }),
        },
      },
    });

    const response = await sesClient.send(command);
    console.log('✅ Email sent successfully via SES');
    console.log('📋 Message ID:', response.MessageId);
  } catch (error) {
    console.error('❌ Failed to send email via SES:', error);
    throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use sendEmail() instead
 */
export async function sendMail(
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> {
  await sendEmail({ to, subject, text, html });
}
