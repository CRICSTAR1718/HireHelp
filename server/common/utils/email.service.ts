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

interface WelcomeEmailParams {
  to: string;
  name: string;
  role: string;
  email: string;
  temporaryPassword: string;
  loginUrl: string;
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
 * Generate HTML template for welcome email with HireHelp branding
 */
function generateWelcomeEmailTemplate(params: WelcomeEmailParams): string {
  const { name, role, email, temporaryPassword, loginUrl } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to HireHelp</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .welcome-text {
      font-size: 18px;
      color: #1e293b;
      margin-bottom: 20px;
    }
    .info-box {
      background-color: #f1f5f9;
      border-left: 4px solid #2563eb;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-box h3 {
      margin: 0 0 10px 0;
      color: #1e293b;
      font-size: 16px;
    }
    .info-item {
      margin: 10px 0;
      color: #475569;
    }
    .info-item strong {
      color: #1e293b;
    }
    .password-box {
      background-color: #fef3c7;
      border: 2px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 6px;
      text-align: center;
    }
    .password-box .password {
      font-size: 24px;
      font-weight: bold;
      color: #1e293b;
      letter-spacing: 2px;
      margin: 10px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: #ffffff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
      border-top: 1px solid #e2e8f0;
    }
    .warning {
      color: #dc2626;
      font-weight: 600;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to HireHelp</h1>
    </div>
    
    <div class="content">
      <p class="welcome-text">
        Dear <strong>${name}</strong>,
      </p>
      
      <p class="welcome-text">
        Your account has been successfully created in the HireHelp platform. We're excited to have you on board as part of our team!
      </p>
      
      <div class="info-box">
        <h3>👤 Account Details</h3>
        <div class="info-item">
          <strong>Role:</strong> ${role}
        </div>
        <div class="info-item">
          <strong>Email:</strong> ${email}
        </div>
      </div>
      
      <div class="password-box">
        <p style="margin: 0; color: #92400e; font-weight: 600;">🔐 Your Temporary Password</p>
        <div class="password">${temporaryPassword}</div>
        <p class="warning">⚠️ Please change your password after your first login for security reasons.</p>
      </div>
      
      <p style="text-align: center; margin: 20px 0;">
        <a href="${loginUrl}" class="button">Login to HireHelp</a>
      </p>
      
      <p style="color: #64748b; font-size: 14px; margin: 20px 0;">
        If you have any questions or need assistance, please contact your administrator.
      </p>
    </div>
    
    <div class="footer">
      <p>© 2024 HireHelp. All rights reserved.</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send welcome email to newly created HR/Admin/Interviewer users
 * @param params - Welcome email parameters
 * @returns Promise that resolves when email is sent (or fails gracefully)
 */
export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<void> {
  const { to, name, role, email, temporaryPassword, loginUrl } = params;

  const subject = 'Welcome to HireHelp - Your Account Has Been Created';
  const text = `
Dear ${name},

Your account has been successfully created in the HireHelp platform.

Account Details:
- Role: ${role}
- Email: ${email}

Your Temporary Password: ${temporaryPassword}

Please change your password after your first login for security reasons.

Login URL: ${loginUrl}

If you have any questions or need assistance, please contact your administrator.

© 2024 HireHelp. All rights reserved.
  `;

  const html = generateWelcomeEmailTemplate(params);

  try {
    await sendEmail({ to, subject, text, html });
    console.log(`✅ Welcome email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${to}:`, error);
    // Do not throw - email failure should not prevent user creation
    // Log the error for monitoring purposes
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
