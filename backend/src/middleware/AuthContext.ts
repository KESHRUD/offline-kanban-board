import { Request, Response, NextFunction } from 'express';

// Simple auth middleware for demo purposes

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  // For demo purposes, extract user from header or use default
  const userId = req.headers['x-user-id'] as string || 'default';
  const username = req.headers['x-username'] as string || 'anonymous';
  
  req.user = {
    id: userId,
    username: username
  };
  
  next();
};

export default authMiddleware;
