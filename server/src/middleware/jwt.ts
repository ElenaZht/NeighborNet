import { Response, NextFunction } from 'express';
import { validateToken } from '../helpers/jwt_utils';
import { AuthRequest } from '../types/index';

export const verifyAccessToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }
    
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        res.status(500).json({ message: 'Server configuration error.' });
        return;
    }
    
    const decoded = validateToken(token, accessTokenSecret);
    
    if (!decoded) {
        res.status(403).json({ message: 'Invalid or expired token' });
        return;
    }
    
    req.user = {
      ...decoded,
      user_id: decoded.user_id,
    };
    next();
};

export const verifyRefreshToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.body.refreshToken || req.cookies.refreshToken;
    
    if (!token) {
        res.status(401).json({ message: 'Refresh token not provided' });
        return;
    }
    
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret) {
        res.status(500).json({ message: 'Server configuration error.' });
        return;
    }
    
    const decoded = validateToken(token, refreshTokenSecret);
    
    if (!decoded) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
        return;
    }
    
    req.user = {
      ...decoded,
      user_id: decoded.user_id,
    };
    next();
};
