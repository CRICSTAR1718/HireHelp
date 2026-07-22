import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';
import { publishEvent } from '../../../events/bus';
import { events } from '../../../events/catalog';
import { env } from '../../../config/env.js';
import { RegisterInput, LoginInput } from './auth.schema.js';
import { otpService } from './otp.service.js';

export class AuthService {
  // Candidate registers: create a candidate record (isVerified defaults to false),
  // generate registration OTP and email it. Do NOT issue token yet.

  
async register(data: RegisterInput) {
  console.log("\n========== CANDIDATE REGISTRATION ==========");
  console.log("Incoming Request:", data);

  const existing = await authRepository.findByEmail(data.email);

  console.log("findByEmail Result:", existing);

  if (existing) {
    console.log("Registration blocked. Email already exists.");
    throw new Error("Email already registered");
  }

  console.log("Creating candidate...");

  const candidate = await authRepository.create(data);

  console.log("Candidate Created:", candidate);

  console.log("Generating OTP...");

  await otpService.generateAndSend({
    email: candidate.email,
    purpose: "REGISTRATION",
    candidateId: candidate.id,
  });

  console.log("OTP sent successfully.");

  return {
    success: true,
    message: "Verification OTP sent.",
  };
}

  async verifyRegistration(email: string, otp: string) {
    const candidate = await authRepository.findByEmail(email);
    if (!candidate) throw new Error('Candidate not found');

    await otpService.verify({ email, otp, purpose: 'REGISTRATION' });
    await authRepository.markVerifiedByEmail(email);

    // publish event now that account is verified
    await publishEvent(events.CandidateRegistered, {
      id: candidate.id,
      email: candidate.email,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
    });

    const token = this.generateToken(candidate);
    const { passwordHash, ...candidateData } = candidate;
    return { success: true, token, candidate: candidateData };
  }

  async login(data: LoginInput) {
    const candidate = await authRepository.findByEmail(data.email);
    if (!candidate) {
      throw new Error('Email is not registered');
    }

    if (!candidate.passwordHash) {
      throw new Error('This account was sourced by HR. Please complete registration to set a password.');
    }

    const isValid = await authRepository.verifyPassword(data.password, candidate.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    if (!candidate.isVerified) throw new Error('Email not verified');

    const token = this.generateToken(candidate);
    const { passwordHash, ...candidateData } = candidate;
    return { success: true, token, candidate: candidateData };
  }

  async verifyLoginOtp(email: string, otp: string) {
    const candidate = await authRepository.findByEmail(email);
    if (!candidate) throw new Error('Candidate not found');

    await otpService.verify({ email, otp, purpose: 'LOGIN' });
    const token = this.generateToken(candidate);
    const { passwordHash, ...candidateData } = candidate;
    return { success: true, token, candidate: candidateData };
  }

  async resendOtp(email: string, purpose: string) {
    const allowed = await otpService.canResend(email, purpose);
    if (!allowed) throw new Error('Resend cooldown active');
    const candidate = await authRepository.findByEmail(email);
    const candidateId = candidate?.id;
    await otpService.generateAndSend({ email, purpose, candidateId });
    return { success: true, message: 'Verification OTP sent.' };
  }

  async forgotPassword(email: string) {
    const candidate = await authRepository.findByEmail(email);
    if (!candidate) throw new Error('Candidate not found');
    await otpService.generateAndSend({ email, purpose: 'PASSWORD_RESET', candidateId: candidate.id });
    return { success: true, message: 'Password reset OTP sent.' };
  }

  async verifyResetOtp(email: string, otp: string) {
    await otpService.verify({ email, otp, purpose: 'PASSWORD_RESET' });
    return { success: true };
  }

  async resetPassword(email: string, newPassword: string) {
    await authRepository.updatePasswordByEmail(email, newPassword);
    return { success: true };
  }

  async getProfile(id: number) {
    const candidate = await authRepository.findById(id);
    if (!candidate) {
      throw new Error('Candidate not found');
    }

    const { passwordHash, ...candidateData } = candidate;
    return candidateData;
  }

  async changePassword(id: number, currentPassword: string, newPassword: string) {
    const candidate = await authRepository.findById(id);
    if (!candidate) {
      throw new Error('Candidate not found');
    }

    if (!candidate.passwordHash) {
      throw new Error('This account was sourced by HR. Please complete registration to set a password.');
    }

    const isValid = await authRepository.verifyPassword(currentPassword, candidate.passwordHash!);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    await authRepository.updatePassword(id, newPassword);
    return { success: true, message: 'Password changed successfully' };
  }

  private generateToken(candidate: { id: number; email: string }): string {
    return jwt.sign(
      { id: candidate.id, email: candidate.email },
      env.CANDIDATE_JWT_SECRET,
      { expiresIn: env.CANDIDATE_JWT_EXPIRES_IN } as jwt.SignOptions
    );
  }
}

export const authService = new AuthService();
