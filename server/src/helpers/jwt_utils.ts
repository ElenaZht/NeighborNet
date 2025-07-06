import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/index.js';
import { config } from '../config/index';

interface User {
  user_id?: number;
  id?: number;
  username: string;
  email: string;
}

export const generateAccessToken = (user: User): string => {
    const payload: JwtPayload = {
      user_id: user.user_id || user.id || 0,
      username: user.username,
      email: user.email
    };
    
    return jwt.sign(payload as object, config.jwt.accessTokenSecret, { 
        expiresIn: config.jwt.accessTokenMaxAge 
    } as jwt.SignOptions);
};

export const generateRefreshToken = (user: User): string => {
    const payload: JwtPayload = {
      user_id: user.user_id || user.id || 0,
      username: user.username,
      email: user.email
    };

    return jwt.sign(payload as object, config.jwt.refreshTokenSecret, { 
        expiresIn: config.jwt.refreshTokenMaxAge 
    } as jwt.SignOptions);
};

export const validateToken = (token: string, secret: string): JwtPayload | null => {
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
      return null;
    }
};
