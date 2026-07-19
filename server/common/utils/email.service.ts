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

interface RoleUpdatedEmailParams {
  to: string;
  name: string;
  previousRole: string;
  newRole: string;
  loginUrl: string;
}

interface PasswordResetEmailParams {
  to: string;
  name: string;
  resetLink?: string;
  otp?: string;
  expirationMinutes: number;
  loginUrl: string;
}

interface OfferEmailParams {
  to: string;
  candidateName: string;
  jobTitle: string;
  loginUrl: string;
  offerLetterUrl?: string;
}

interface RejectionEmailParams {
  to: string;
  candidateName: string;
  jobTitle: string;
  loginUrl: string;
}

interface TalentPoolNotificationParams {
  to: string;
  candidateName: string;
  jobTitle: string;
  department: string;
  location: string;
  employmentType: string;
  jobUrl: string;
}

/**
 * Generic email sending function using AWS SES
 * @param params - Email parameters (to, subject, text, html)
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail({ to, subject, text, html }: EmailParams): Promise<void> {
  console.log(`📨 sendEmail called with:`, JSON.stringify({ to, subject, textLength: text.length, hasHtml: !!html }, null, 2))
  
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

    console.log(`🔧 Creating SendEmailCommand`)
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
    console.log(`✅ SendEmailCommand created, about to send`)

    console.log(`📤 Calling sesClient.send()`)
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
 * Generate HTML template for role updated email
 */
function generateRoleUpdatedEmailTemplate(params: RoleUpdatedEmailParams): string {
  const { name, previousRole, newRole, loginUrl } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Role Updated - HireHelp</title>
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
    .role-change-box {
      background-color: #f1f5f9;
      border-left: 4px solid #2563eb;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .role-item {
      margin: 15px 0;
      color: #475569;
    }
    .role-item strong {
      color: #1e293b;
    }
    .arrow {
      text-align: center;
      font-size: 24px;
      color: #2563eb;
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Role Updated</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #1e293b; margin-bottom: 20px;">
        Dear <strong>${name}</strong>,
      </p>
      
      <p style="color: #475569; margin-bottom: 20px;">
        Your role in the HireHelp platform has been updated. Please review the changes below:
      </p>
      
      <div class="role-change-box">
        <div class="role-item">
          <strong>Previous Role:</strong> ${previousRole}
        </div>
        <div class="arrow">↓</div>
        <div class="role-item">
          <strong>New Role:</strong> ${newRole}
        </div>
      </div>
      
      <p style="text-align: center; margin: 20px 0;">
        <a href="${loginUrl}" class="button">Login to HireHelp</a>
      </p>
      
      <p style="color: #64748b; font-size: 14px; margin: 20px 0;">
        If you have any questions about this change, please contact your administrator.
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
 * Send role updated email to users when their role is changed
 * @param params - Role updated email parameters
 * @returns Promise that resolves when email is sent (or fails gracefully)
 */
export async function sendRoleUpdatedEmail(params: RoleUpdatedEmailParams): Promise<void> {
  const { to, name, previousRole, newRole, loginUrl } = params;

  const subject = 'Your HireHelp Role Has Been Updated';
  const text = `
Dear ${name},

Your role in the HireHelp platform has been updated.

Previous Role: ${previousRole}
New Role: ${newRole}

Please login to review your new permissions and access.

Login URL: ${loginUrl}

If you have any questions about this change, please contact your administrator.

© 2024 HireHelp. All rights reserved.
  `;

  const html = generateRoleUpdatedEmailTemplate(params);

  try {
    await sendEmail({ to, subject, text, html });
    console.log(`✅ Role updated email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send role updated email to ${to}:`, error);
    // Do not throw - email failure should not prevent role update
  }
}

/**
 * Generate HTML template for password reset email
 */
function generatePasswordResetEmailTemplate(params: PasswordResetEmailParams): string {
  const { name, resetLink, otp, expirationMinutes, loginUrl } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - HireHelp</title>
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
    .reset-box {
      background-color: #fef3c7;
      border: 2px solid #f59e0b;
      padding: 20px;
      margin: 20px 0;
      border-radius: 6px;
      text-align: center;
    }
    .reset-code {
      font-size: 32px;
      font-weight: bold;
      color: #1e293b;
      letter-spacing: 3px;
      margin: 15px 0;
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
    .warning {
      background-color: #fee2e2;
      border-left: 4px solid #dc2626;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
      color: #991b1b;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #1e293b; margin-bottom: 20px;">
        Dear <strong>${name}</strong>,
      </p>
      
      <p style="color: #475569; margin-bottom: 20px;">
        We received a request to reset your password. ${resetLink ? 'Click the button below to reset your password:' : 'Use the verification code below to reset your password:'}
      </p>
      
      ${otp ? `
      <div class="reset-box">
        <p style="margin: 0; color: #92400e; font-weight: 600;">🔐 Your Verification Code</p>
        <div class="reset-code">${otp}</div>
        <p style="color: #92400e; font-size: 14px;">Valid for ${expirationMinutes} minutes</p>
      </div>
      ` : ''}
      
      ${resetLink ? `
      <p style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" class="button">Reset Password</a>
      </p>
      ` : ''}
      
      <div class="warning">
        <strong>⚠️ Security Notice:</strong> If you did not request this password reset, please ignore this email and contact support immediately.
      </div>
      
      <p style="color: #64748b; font-size: 14px; margin: 20px 0;">
        This link/code will expire in ${expirationMinutes} minutes for your security.
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
 * Send password reset email
 * @param params - Password reset email parameters
 * @returns Promise that resolves when email is sent (or fails gracefully)
 */
export async function sendPasswordResetEmail(params: PasswordResetEmailParams): Promise<void> {
  const { to, name, resetLink, otp, expirationMinutes, loginUrl } = params;

  const subject = 'Reset Your HireHelp Password';
  const text = `
Dear ${name},

We received a request to reset your password.

${otp ? `Your verification code is: ${otp}` : `Reset your password at: ${resetLink}`}

This code/link will expire in ${expirationMinutes} minutes for your security.

⚠️ Security Notice: If you did not request this password reset, please ignore this email and contact support immediately.

Login URL: ${loginUrl}

© 2024 HireHelp. All rights reserved.
  `;

  const html = generatePasswordResetEmailTemplate(params);

  try {
    await sendEmail({ to, subject, text, html });
    console.log(`✅ Password reset email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send password reset email to ${to}:`, error);
    // Do not throw - email failure should not prevent password reset flow
  }
}

/**
 * Generate HTML template for offer email
 */
function generateOfferEmailTemplate(params: OfferEmailParams): string {
  const { candidateName, jobTitle, offerLetterUrl } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Congratulations! - HireHelp</title>
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
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
    .congrats-box {
      background-color: #d1fae5;
      border-left: 4px solid #10b981;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .job-title {
      font-size: 20px;
      font-weight: bold;
      color: #1e293b;
      margin: 15px 0;
    }
    .offer-letter {
      background-color: #f1f5f9;
      padding: 15px;
      margin: 20px 0;
      border-radius: 6px;
      text-align: center;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Congratulations!</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #1e293b; margin-bottom: 20px;">
        Dear <strong>${candidateName}</strong>,
      </p>
      
      <div class="congrats-box">
        <p style="margin: 0; color: #065f46; font-weight: 600;">
          We are pleased to inform you that you have been selected for the position!
        </p>
      </div>
      
      <div class="job-title">
        Position: ${jobTitle}
      </div>
      
      <p style="color: #475569; margin-bottom: 20px;">
        After careful consideration of your application and interview performance, we are delighted to extend this offer to join our team. Your skills and experience impressed us, and we believe you will be a valuable addition to our organization.
      </p>
      
      ${offerLetterUrl ? `
      <div class="offer-letter">
        <p style="margin: 0 0 10px 0; color: #1e293b; font-weight: 600;">📄 Your Offer Letter</p>
        <a href="${offerLetterUrl}" style="color: #2563eb; text-decoration: none;">Download Offer Letter</a>
      </div>
      ` : ''}
      
      <p style="color: #475569; margin-top: 30px;">
        We look forward to welcoming you to our team!
      </p>
      
      <p style="color: #475569; margin-top: 20px;">
        Best regards,<br>
        HireHelp Team
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
 * Send offer email to candidates when status changes to "Offered"
 * @param params - Offer email parameters
 * @returns Promise that resolves when email is sent (or fails gracefully)
 */
export async function sendOfferEmail(params: OfferEmailParams): Promise<void> {
  console.log(`📨 sendOfferEmail called with params:`, JSON.stringify(params, null, 2))
  const { to, candidateName, jobTitle, loginUrl, offerLetterUrl } = params;

  const subject = 'Congratulations! Your Offer from HireHelp';
  const text = `
Dear ${candidateName},

We are pleased to inform you that you have been selected for the position!

Position: ${jobTitle}

After careful consideration of your application and interview performance, we are delighted to extend this offer to join our team. Your skills and experience impressed us, and we believe you will be a valuable addition to our organization.

${offerLetterUrl ? `You can download your formal offer letter at: ${offerLetterUrl}` : ''}

We look forward to welcoming you to our team!

Best regards,
HireHelp Team

© 2024 HireHelp. All rights reserved.
  `;

  console.log(`📧 About to generate HTML template`)
  const html = generateOfferEmailTemplate(params);
  console.log(`✅ HTML template generated successfully`)

  try {
    console.log(`📤 About to call sendEmail`)
    await sendEmail({ to, subject, text, html });
    console.log(`✅ Offer email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send offer email to ${to}:`, error);
    // Do not throw - email failure should not prevent status update
  }
}

/**
 * Generate HTML template for rejection email
 */
function generateRejectionEmailTemplate(params: RejectionEmailParams): string {
  const { candidateName, jobTitle } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Update - HireHelp</title>
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
      background: linear-gradient(135deg, #64748b 0%, #475569 100%);
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
    .thank-you {
      background-color: #f1f5f9;
      border-left: 4px solid #64748b;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .job-title {
      font-size: 18px;
      font-weight: bold;
      color: #1e293b;
      margin: 15px 0;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Application Update</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #1e293b; margin-bottom: 20px;">
        Dear <strong>${candidateName}</strong>,
      </p>
      
      <div class="thank-you">
        <p style="margin: 0; color: #475569; font-weight: 600;">
          Thank you for your interest in joining our team and for the time you invested in the application process.
        </p>
      </div>
      
      <div class="job-title">
        Position Applied: ${jobTitle}
      </div>
      
      <p style="color: #475569; margin-bottom: 20px;">
        After careful consideration of your application and qualifications, we regret to inform you that we are not able to proceed with your candidacy at this time. This was a difficult decision as we received many qualified applications.
      </p>
      
      <p style="color: #475569; margin-bottom: 20px;">
        We were impressed by your skills and experience, and we encourage you to apply for future positions that match your qualifications. Your profile will remain in our talent pool for consideration.
      </p>
      
      <p style="color: #475569; margin-top: 30px;">
        We wish you the very best in your career journey.
      </p>
      
      <p style="color: #475569; margin-top: 20px;">
        Best regards,<br>
        HireHelp Team
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
 * Send rejection email to candidates when status changes to "Rejected"
 * @param params - Rejection email parameters
 * @returns Promise that resolves when email is sent (or fails gracefully)
 */
export async function sendRejectionEmail(params: RejectionEmailParams): Promise<void> {
  const { to, candidateName, jobTitle, loginUrl } = params;

  const subject = 'Update Regarding Your Application';
  const text = `
Dear ${candidateName},

Thank you for your interest in joining our team and for the time you invested in the application process.

Position Applied: ${jobTitle}

After careful consideration of your application and qualifications, we regret to inform you that we are not able to proceed with your candidacy at this time. This was a difficult decision as we received many qualified applications.

We were impressed by your skills and experience, and we encourage you to apply for future positions that match your qualifications. Your profile will remain in our talent pool for consideration.

We wish you the very best in your career journey.

Best regards,
HireHelp Team

© 2024 HireHelp. All rights reserved.
  `;

  const html = generateRejectionEmailTemplate(params);

  try {
    await sendEmail({ to, subject, text, html });
    console.log(`✅ Rejection email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send rejection email to ${to}:`, error);
    // Do not throw - email failure should not prevent status update
  }
}

interface InterviewScheduledEmailParams {
  to: string;
  candidateName: string;
  jobTitle: string;
  interviewerName: string;
  startTime: Date;
  endTime: Date;
  meetingLink?: string;
  location?: string;
}

function generateInterviewScheduledEmailTemplate(params: InterviewScheduledEmailParams): string {
  const { candidateName, jobTitle, interviewerName, startTime, endTime, meetingLink, location } = params;
  const dateStr = startTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = `${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

  return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="background-color: #4f46e5; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Interview Scheduled</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="font-size: 16px; color: #333;">Hi ${candidateName},</p>
              <p style="font-size: 15px; color: #555; line-height: 1.6;">
                Your interview for the <strong>${jobTitle}</strong> position has been scheduled. Details below:
              </p>
              <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #f9fafb; border-radius: 6px; margin: 20px 0;">
                <tr><td style="color: #666; width: 130px;">Date</td><td style="color: #111; font-weight: 600;">${dateStr}</td></tr>
                <tr><td style="color: #666;">Time</td><td style="color: #111; font-weight: 600;">${timeStr}</td></tr>
                <tr><td style="color: #666;">Interviewer</td><td style="color: #111; font-weight: 600;">${interviewerName}</td></tr>
                ${location ? `<tr><td style="color: #666;">Location</td><td style="color: #111; font-weight: 600;">${location}</td></tr>` : ''}
              </table>
              ${meetingLink ? `
              <div style="text-align: center; margin: 28px 0;">
                <a href="${meetingLink}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 15px;">Join Google Meet</a>
              </div>
              <p style="font-size: 13px; color: #888; text-align: center; word-break: break-all;">${meetingLink}</p>
              ` : ''}
              <p style="font-size: 14px; color: #555; line-height: 1.6;">
                A calendar invite has also been sent to this email address. Please add it to your calendar so you don't miss it.
              </p>
              <p style="font-size: 15px; color: #333; margin-top: 24px;">Best of luck,<br/>HireHelp Team</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f4f4f7; padding: 16px; text-align: center; font-size: 12px; color: #999;">
              © 2024 HireHelp. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Sent to the CANDIDATE when an interview is scheduled (either via the
 * "assign interviewer" flow or the direct "Schedule Interview" page). Both
 * flows should call this after schedulingService.sendInvitation() succeeds.
 */
export async function sendInterviewScheduledEmail(params: InterviewScheduledEmailParams): Promise<void> {
  const { to, candidateName, jobTitle, interviewerName, startTime, endTime, meetingLink } = params;

  const subject = `Interview Scheduled: ${jobTitle}`;
  const dateStr = startTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = `${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

  const text = `
Dear ${candidateName},

Your interview for the ${jobTitle} position has been scheduled.

Date: ${dateStr}
Time: ${timeStr}
Interviewer: ${interviewerName}
${meetingLink ? `Google Meet link: ${meetingLink}` : ''}

A calendar invite has also been sent to this email address.

Best of luck,
HireHelp Team

© 2024 HireHelp. All rights reserved.
  `;

  const html = generateInterviewScheduledEmailTemplate(params);

  try {
    await sendEmail({ to, subject, text, html });
    console.log(`✅ Interview-scheduled email sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send interview-scheduled email to ${to}:`, error);
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

/**
 * Generate HTML template for Talent Pool job notification email
 */
function generateTalentPoolNotificationTemplate(params: TalentPoolNotificationParams): string {
  const { candidateName, jobTitle, department, location, employmentType, jobUrl } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Job Opportunity - HireHelp</title>
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
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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
    .job-details {
      background-color: #f1f5f9;
      border-left: 4px solid #3b82f6;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .job-detail-item {
      margin: 10px 0;
      color: #475569;
    }
    .job-detail-item strong {
      color: #1e293b;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Job Opportunity at HireHelp</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #1e293b; margin-bottom: 20px;">
        Hello <strong>${candidateName}</strong>,
      </p>
      
      <p style="color: #475569; margin-bottom: 20px;">
        We hope you're doing well.
      </p>

      <p style="color: #475569; margin-bottom: 20px;">
        A new job opportunity has been published on HireHelp.
      </p>

      <p style="color: #475569; margin-bottom: 20px;">
        We'd love to invite you to explore the opportunity and apply if you're interested.
      </p>
      
      <div class="job-details">
        <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px;">Job Details</h3>
        <div class="job-detail-item">
          <strong>Job Title:</strong> ${jobTitle}
        </div>
        <div class="job-detail-item">
          <strong>Department:</strong> ${department || 'Not specified'}
        </div>
        <div class="job-detail-item">
          <strong>Location:</strong> ${location || 'Not specified'}
        </div>
        <div class="job-detail-item">
          <strong>Employment Type:</strong> ${employmentType || 'Not specified'}
        </div>
      </div>
      
      <p style="text-align: center; margin: 20px 0;">
        <a href="${jobUrl}" class="button">View Job</a>
      </p>
      
      <p style="color: #64748b; font-size: 14px; margin: 20px 0;">
        Thank you,<br>
        HireHelp Recruitment Team
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
 * Send Talent Pool job notification email
 * @param params - Talent Pool notification parameters
 * @returns Promise that resolves when email is sent (or fails gracefully)
 */
export async function sendTalentPoolNotification(params: TalentPoolNotificationParams): Promise<void> {
  console.log(`📨 sendTalentPoolNotification called with params:`, JSON.stringify(params, null, 2))
  const { to, candidateName, jobTitle, department, location, employmentType, jobUrl } = params;

  const subject = 'New Job Opportunity at HireHelp';
  const text = `
Hello ${candidateName},

We hope you're doing well.

A new job opportunity has been published on HireHelp.

We'd love to invite you to explore the opportunity and apply if you're interested.

Job Details:
• Job Title: ${jobTitle}
• Department: ${department || 'Not specified'}
• Location: ${location || 'Not specified'}
• Employment Type: ${employmentType || 'Not specified'}

Click the link below to view the complete job description and apply:
${jobUrl}

Thank you,
HireHelp Recruitment Team

© 2024 HireHelp. All rights reserved.
  `;

  const html = generateTalentPoolNotificationTemplate(params);

  try {
    console.log(`📤 About to call sendEmail for Talent Pool notification`)
    await sendEmail({ to, subject, text, html });
    console.log(`✅ Talent Pool notification sent successfully to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send Talent Pool notification to ${to}:`, error);
    throw error;
  }
}
