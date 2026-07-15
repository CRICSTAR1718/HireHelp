import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { authService } from './auth.service';
import { authRepository } from './auth.repository';

const mockAuthRepository = {
  findByEmail: jest.fn() as any,
  create: jest.fn() as any,
  verifyPassword: jest.fn() as any,
  findById: jest.fn() as any,
};

jest.mock('./auth.repository', () => ({
  authRepository: mockAuthRepository,
}));

jest.mock('../events/kafka-producer', () => ({
  publishCandidateRegistered: jest.fn() as any,
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new candidate', async () => {
      const mockCandidate = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        passwordHash: 'hashed',
      };
      
      (mockAuthRepository.findByEmail as any).mockResolvedValue(undefined);
      (mockAuthRepository.create as any).mockResolvedValue(mockCandidate);
      
      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result).toHaveProperty('token');
      expect(result.candidate.email).toBe('test@example.com');
    });

    it('should throw error if email already exists', async () => {
      (mockAuthRepository.findByEmail as any).mockResolvedValue({ id: 1 });
      
      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
        })
      ).rejects.toThrow('Email already registered');
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const mockCandidate = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        passwordHash: 'hashed',
      };
      
      (mockAuthRepository.findByEmail as any).mockResolvedValue(mockCandidate);
      (mockAuthRepository.verifyPassword as any).mockResolvedValue(true);
      
      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('token');
      expect(result.candidate.email).toBe('test@example.com');
    });

    it('should throw error with invalid credentials', async () => {
      (mockAuthRepository.findByEmail as any).mockResolvedValue(undefined);
      
      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
