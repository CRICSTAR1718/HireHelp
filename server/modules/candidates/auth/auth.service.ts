import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';
import { publishEvent } from '../../../events/bus';
import { events } from '../../../events/catalog';
import { env } from '../../../config/env';
import { RegisterInput, LoginInput } from './auth.schema.js';

export class AuthService {
  async register(data: RegisterInput) {
    const existing = await authRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const candidate = await authRepository.create(data);
    
    // ENABLED — was dead/commented-out code in the original repo.
    await publishEvent(events.CandidateRegistered, {
      id: candidate.id,
      email: candidate.email,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
    });

    const token = this.generateToken(candidate);
    
    return {
      token,
      candidate: {
        id: candidate.id,
        email: candidate.email,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
      },
    };
  }

  async login(data: LoginInput) {
    const candidate = await authRepository.findByEmail(data.email);
    if (!candidate) {
      throw new Error('Invalid credentials');
    }

    const isValid = await authRepository.verifyPassword(data.password, candidate.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(candidate);
    
    return {
      token,
      candidate: {
        id: candidate.id,
        email: candidate.email,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
      },
    };
  }

  async getProfile(id: number) {
    const candidate = await authRepository.findById(id);
    if (!candidate) {
      throw new Error('Candidate not found');
    }
    
    const { passwordHash, ...candidateData } = candidate;
    return candidateData;
  }

  private generateToken(candidate: { id: number; email: string }): string {
    // CHANGED: was reading process.env.JWT_SECRET directly with a
    // 'default_secret' fallback — the same env var name staff auth uses.
    // Harmless as separate services, but dangerous once merged into one
    // process: a leaked/guessed default could let a candidate token pass
    // staff auth checks or vice versa. Uses its own dedicated secret now,
    // and no insecure fallback — env.ts already fails startup if missing.
    return jwt.sign(
      { id: candidate.id, email: candidate.email },
      env.CANDIDATE_JWT_SECRET,
      { expiresIn: env.CANDIDATE_JWT_EXPIRES_IN } as jwt.SignOptions
    );
  }
}

export const authService = new AuthService();
