import { describe, it, expect } from 'vitest';
import { hashPassword, comparePasswords, generateToken, verifyToken } from '../../utils/auth';

describe('Auth Utils', () => {
  describe('Password Hashing', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should verify a correct password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);
      
      const isValid = await comparePasswords(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);
      
      const isValid = await comparePasswords('wrongPassword', hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT Token', () => {
    it('should generate a valid token', () => {
      const payload = { userId: 'user123', email: 'test@example.com' };
      const token = generateToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should verify a valid token', () => {
      const payload = { userId: 'user123', email: 'test@example.com' };
      const token = generateToken(payload);
      const decoded = verifyToken(token);
      
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe('user123');
      expect(decoded?.email).toBe('test@example.com');
    });

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid-token');
      expect(decoded).toBeNull();
    });
  });
});
