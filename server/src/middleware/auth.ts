import { Response, NextFunction } from 'express';
import { validateToken } from '../helpers/jwt_utils';
import { AuthRequest } from '../types/index';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authorization header is missing or malformed.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            res.status(500).json({ message: 'Server configuration error.' });
            return;
        }

        const decoded = validateToken(token!, secret);
        if (!decoded) {
            res.status(401).json({ message: 'Invalid or expired access token.' });
            return;
        }
        
        req.user = {
          ...decoded,
          user_id: decoded.user_id,
        };
        next();
        
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid or expired access token.' });
    }
};
