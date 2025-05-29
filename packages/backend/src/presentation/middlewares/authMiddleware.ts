import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { container } from '../../shared/dependency-injection/inversify.config';
import { TYPES } from '../../shared/dependency-injection/types';

interface TokenPayload {
  userId: string;
  roles: string[];
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'default_secret';
    const decoded = jwt.verify(token, secret) as TokenPayload;
    
    // Add user info to request for use in controllers
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = (req as any).user;
      
      if (!user) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }
      
      const hasRole = user.roles.some((role: string) => roles.includes(role));
      
      if (!hasRole) {
        res.status(403).json({ message: 'Insufficient permissions' });
        return;
      }
      
      next();
    } catch (error) {
      res.status(500).json({ message: 'Authorization error' });
    }
  };
};

