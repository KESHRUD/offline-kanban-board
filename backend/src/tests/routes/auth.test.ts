import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../../utils/auth';

describe('Auth Utils', () => {
  describe('Password Hashing', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123';
      const hashed = await hashPassword(password);
      expect(hashed).toBeDefined();
      expect(hashed).not.toBe(password);
    });

    it('should verify correct password', async () => {
      const password = 'testpassword123';
      const hashed = await hashPassword(password);
      const isValid = await comparePassword(password, hashed);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testpassword123';
      const hashed = await hashPassword(password);
      const isValid = await comparePassword('wrongpassword', hashed);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT Tokens', () => {
    it('should generate a valid token', () => {
      const token = generateToken('user123');
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should verify a valid token', () => {
      const token = generateToken('user123');
      const decoded = verifyToken(token);
      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe('user123');
    });

    it('should reject invalid token', () => {
      const decoded = verifyToken('invalid.token.here');
      expect(decoded).toBeNull();
    });
  });
});
