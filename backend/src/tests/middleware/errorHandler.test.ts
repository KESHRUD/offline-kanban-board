
import { describe, it, expect, vi } from 'vitest';
import { errorHandler } from '../../middleware/errorHandler';
import type { Request, Response, NextFunction } from 'express';

describe('errorHandler middleware', () => {
  it('should handle errors and send response', () => {
    const err = new Error('Test error');
    const req = {} as Partial<Request>;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as Partial<Response>;
    const next = vi.fn() as NextFunction;
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', status: 'error' });
  });
});