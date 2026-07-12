import { Request, Response, NextFunction } from 'express';

// Mock auth middleware — reads X-Mock-Role to determine identity
export const mockAuth = (req: Request, res: Response, next: NextFunction) => {
  const role = req.header('X-Mock-Role') || 'ADMIN';
  
  if (role === 'USER') {
    req.user = {
      id: 'seed-standard-user-id',
      role: 'USER',
    };
  } else {
    req.user = {
      id: 'seed-admin-user-id',
      role: 'ADMIN',
    };
  }
  
  next();
};
