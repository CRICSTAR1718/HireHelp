import nodemailer from 'nodemailer';
import { env } from '../../config/env';

let transporter: nodemailer.Transporter | null = null;

if (env.MAIL_HOST && env.MAIL_HOST.length) {
  transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT ? Number(env.MAIL_PORT) : 587,
    auth: env.MAIL_USER ? { user: env.MAIL_USER, pass: env.MAIL_PASS } : undefined,
  });
}

// export async function sendMail(to: string, subject: string, text: string, html?: string) {
//   if (!transporter) {
//     console.warn('Mailer not configured — skipping email to', to);
//     return;
//   }

//   await transporter.sendMail({
//     from: env.MAIL_FROM || 'no-reply@hirehelp.local',
//     to,
//     subject,
//     text,
//     html,
//   });
// }


export async function sendMail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  if (!transporter) {
    console.log("❌ Mailer not configured");
    return;
  }

  try {
    console.log("📨 Connecting to Gmail...");
    console.log("Sending email to:", to);

    const info = await transporter.sendMail({
      from: env.MAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent successfully!");
    console.log(info.response);

  } catch (err) {
    console.error("❌ EMAIL ERROR");
    console.error(err);
    throw err;
  }
}