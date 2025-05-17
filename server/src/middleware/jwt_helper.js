import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const ACCESS_TOKEN_EXPIRY = '15m';  // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d';  // 7 days

export const generateAccessToken = (user) => {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

export const generateRefreshToken = (user) => {
    const payload = {
        id: user.id
    };

    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

export const validateToken = (token, secret) => {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
};

// export const verifyAccessToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
    
//     if (!token) {
//       return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }
    
//     const decoded = validateToken(token, ACCESS_TOKEN_SECRET);
    
//     if (!decoded) {
//       return res.status(403).json({ message: 'Invalid or expired token' });
//     }
    
//     req.user = decoded;
//     next();
// };

// export const verifyRefreshToken = (req, res, next) => {
//     const token = req.body.refreshToken || req.cookies.refreshToken;
    
//     if (!token) {
//       return res.status(401).json({ message: 'Refresh token not provided' });
//     }
    
//     const decoded = validateToken(token, REFRESH_TOKEN_SECRET);
    
//     if (!decoded) {
//       return res.status(403).json({ message: 'Invalid or expired refresh token' });
//     }
    
//     req.user = decoded;
//     next();
// };