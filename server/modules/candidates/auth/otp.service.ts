import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { otpRepository } from './otp.repository.js';
import { sendMail } from '../../../common/utils/mailer.js';
import { addMinutes } from 'date-fns';
import { env } from '../../../config/env.js';

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;

function generateNumericOtp() {
  const min = 0; const max = 10 ** OTP_LENGTH - 1;
  const n = crypto.randomInt(min, max + 1);
  return n.toString().padStart(OTP_LENGTH, '0');
}

export class OtpService {
  async generateAndSend({ email, purpose, candidateId }: { email: string; purpose: string; candidateId?: number }) {
    // Invalidate previous OTPs for this email/purpose
    await otpRepository.invalidateByEmailAndPurpose(email, purpose);

    const otp = generateNumericOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = addMinutes(new Date(), OTP_EXPIRY_MINUTES);

    const record = await otpRepository.create({ candidateId, email, otpHash, purpose, expiresAt });

    // send email
    const subject = purpose === 'REGISTRATION' ? 'Verify your HireHelp account' : purpose === 'LOGIN' ? 'HireHelp Login Verification' : 'Reset Your Password';
    const text = `Your verification code is:\n\n${otp}\n\nValid for ${OTP_EXPIRY_MINUTES} minutes.`;
    // await sendMail(email, subject, text);

    console.log("➡️ Calling sendMail()...");

    await sendMail(email, subject, text);

    console.log("✅ sendMail() finished");

    return { id: record.id, otpSent: true };
  }

  async verify({ email, otp, purpose }: { email: string; otp: string; purpose: string }) {
    const record = await otpRepository.findLatestByEmailAndPurpose(email, purpose);
    if (!record) throw new Error('OTP not found');
    if (record.isUsed) throw new Error('OTP already used');
    if (new Date(record.expiresAt) < new Date()) throw new Error('OTP expired');
    if (record.attempts >= MAX_ATTEMPTS) throw new Error('Maximum attempts exceeded');

    const match = await bcrypt.compare(otp, record.otpHash);
    await otpRepository.incrementAttempts(record.id);
    if (!match) throw new Error('Invalid OTP');

    // mark used / invalidate others
    await otpRepository.invalidateByEmailAndPurpose(email, purpose);
    return record;
  }

  async canResend(email: string, purpose: string) {
    const record = await otpRepository.findLatestByEmailAndPurpose(email, purpose);
    if (!record) return true;
    const last = new Date(record.createdAt).getTime();
    return Date.now() - last >= RESEND_COOLDOWN_SECONDS * 1000;
  }
}

export const otpService = new OtpService();
