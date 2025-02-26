import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: { id: number; username: string };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error('No token provided');
    res.sendStatus(401); 
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err);
      res.sendStatus(403); 
      return;
    }

    const payload = decoded as JwtPayload & { id: number; username: string };
    req.user = { id: payload.id, username: payload.username };

    console.log('🛡️ Authenticated user:', req.user); 
    next();
  });
};